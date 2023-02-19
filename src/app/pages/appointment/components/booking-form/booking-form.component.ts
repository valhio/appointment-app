import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription, catchError, Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { BookingType } from 'src/app/enum/booking-type';
import { BookingService } from 'src/app/service/booking.service';
import { Booking } from 'src/app/model/booking';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent {

  @Input() date: Date | undefined;
  @Input() bookingTime: string | null | undefined = '';
  @Input() numberOfBookedBookings: number | undefined;

  monthNames = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    registrationNumber: new FormControl('', Validators.required),
    bookingType: new FormControl(BookingType.YEARLY_TECHNICAL_EVALUATION, Validators.required),
    vehicleCategory: new FormControl('', Validators.required),
  })

  public isLoading = false;
  submitted = false;
  subscriptions: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private bookingService: BookingService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {

    // this.bookingService.dateRef?.get().subscribe(querySnapshot => {
    //   querySnapshot.ref.collection('data').get().then(
    //     querySnapshot => {
    //       let bookingByBookingTime = querySnapshot.docs.find(doc => doc.data()['bookingTime'] === this.data.bookingTime);

    //       console.log('bookingByBookingTime', bookingByBookingTime?.get('firstName'));

    //       // console.log('querySnapshot', querySnapshot.docs.length);
    //       // console.log('querySnapshot', querySnapshot.docs.find(doc => doc.data()['bookingTime'] === this.data.bookingTime)?.get('firstName'));
    //     }
    //   )

    //   let currentNumberOfBookedBookings = querySnapshot.get('numberOfBookedBookings');
    //   console.log('numberOfBookedBookings: ' + currentNumberOfBookedBookings);
    // })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onNoClick(): void {
    // this.dialogRef.close();
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    let year = this.date?.getFullYear();
    let month = this.date?.getMonth();
    let day = (this.date?.getDate());

    const booking = {
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      phone: this.form.get('phone')?.value,
      registrationNumber: this.form.get('registrationNumber')?.value,
      vehicleCategory: this.form.get('vehicleCategory')?.value,
      bookingType: this.form.get('bookingType')?.value,
      bookingDate: this.date,
      bookingTime: this.bookingTime,
      createdAt: new Date(),
    }

    this.subscriptions.push(
      // Check if the booking(collection) already exists
      this.bookingService.getBookingByBookingTime(this.date!, this.bookingTime!).subscribe(querySnapshot => {
        // If the booking(collection) does not exist, add it. Otherwise, alert the user that the booking already exists.
        if (!querySnapshot.exists) {
          this.bookingService.addBooking(booking as Booking);
          // this.bookingService.updateNumberOfBookedBookings(this.date, this.numberOfBookedBookings + 1);
          this.updateBookedBookings(year!, month!, day!, this.numberOfBookedBookings! + 1)
        } else {
          alert('Вече е направена резервация за този часови интервал. Моля, презаредете страницата и опитайте отново.')
        }
      })
    );

    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/booking/status'], {
        queryParams: { action: 'success', time: this.bookingTime, date: this.date },
      });
    }, 2000);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  updateBookedBookings(year: number, month: number, day: number, numberOfBookedBookings: number) {
    this.db.collection('bookings')
      .doc(year.toString())
      .collection(month.toString())
      .doc(day.toString())
      .set({ numberOfBookedBookings }, { merge: true });
  }

  deleteBooking(date: Date, bookingId: string) {
    this.db.collection("bookings").doc(date.getFullYear().toString()).collection(date.getMonth().toString()).doc(date.getDay().toString()).collection("data").doc(bookingId).delete()
      .then(function () {
        console.log("Booking successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing booking: ", error);
      });
  }

}
