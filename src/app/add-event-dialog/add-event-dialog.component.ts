import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Booking } from '../model/booking';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BookingType } from '../enum/booking-type';
import { Subscription, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { BookingService } from '../service/booking.service';

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrls: ['./add-event-dialog.component.scss']
})
export class AddEventDialogComponent implements OnDestroy, OnInit {
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
    private dialogRef: MatDialogRef<AddEventDialogComponent>,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      date: Date,
      bookingTime: string,
      numberOfBookedBookings: number,
    },
    private db: AngularFirestore,
    private router: Router,
    private bookingService: BookingService,
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
    this.dialogRef.close();
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    let year = this.data.date.getFullYear();
    let month = this.data.date.getMonth();
    let day = (this.data.date.getDate());

    const booking = {
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      phone: this.form.get('phone')?.value,
      registrationNumber: this.form.get('registrationNumber')?.value,
      vehicleCategory: this.form.get('vehicleCategory')?.value,
      bookingType: this.form.get('bookingType')?.value,
      bookingDate: this.data.date,
      bookingTime: this.data.bookingTime,
      createdAt: new Date(),
    } as Booking;

    // this.subscriptions.push(
    // Check if the booking(collection) already exists
    this.bookingService.getBookingByBookingTime(this.data.date, this.data.bookingTime).subscribe(querySnapshot => {
      // If the booking(collection) does not exist, add it. Otherwise, alert the user that the booking already exists.
      if (!querySnapshot.exists) {
        this.bookingService.addBooking(booking);
        // this.bookingService.updateNumberOfBookedBookings(this.data.date, this.data.numberOfBookedBookings + 1);
        this.updateBookedBookings(year, month, day, this.data.numberOfBookedBookings + 1)
      } else {
        alert('Booking has already been made for this time slot.')
      }
    })
    // );

    this.isLoading = false;
    this.dialogRef.close();
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
