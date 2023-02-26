import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of, Subscription, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { BookingType } from 'src/app/enum/booking-type';
import { BookingService } from 'src/app/service/booking.service';
import { Booking } from 'src/app/model/booking';
import { FirestoreService } from '../../../../service/firestore-service.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnDestroy, OnInit {

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

  vehicleCategories$: any = null;
  vehicleServices$: any = null;

  constructor(
    private db: AngularFirestore,
    private bookingService: BookingService,
    private router: Router,
    private firestoreService: FirestoreService
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

  submit(): void {
    if (this.form.invalid) return;

    this.submitted = true;
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
      // First check if booking exists. If it does, return false. If it doesn't, create booking.
      // If booking was not created, return false. If it was, get number of booked bookings for that day.
      // Once we have the number of booked bookings, update the number of booked bookings for that day.
      this.bookingService.getBookingByBookingTime(this.date!, this.bookingTime!).pipe( // Get booking by booking time
        switchMap(querySnapshot => {
          if (!querySnapshot.exists) { // If booking does not exist, create it. Otherwise, return false.
            return this.bookingService.addBooking(booking as Booking).pipe( // Create booking
              switchMap(added => {
                if (added) { // If booking was created, get number of booked bookings for that day. Otherwise, return false.
                  return this.bookingService.getNumberOfBookedBookings(this.date!).pipe( // Get number of booked bookings for that day
                    switchMap(bookedHoursCount => {
                      this.updateBookedBookings(year!, month!, day!, bookedHoursCount + 1) // Update number of booked bookings for that day
                      return of(true); // Return true to indicate that booking was created (and number of booked bookings was updated)
                    })
                  )
                } else { // If booking was not created, return false to indicate that booking was not created
                  return of(false);
                }
              })
            )
          } else { // If booking already exists, return false to indicate that booking was not created
            return of(false);
          }
        })
      ).subscribe(res => {
        setTimeout(() => {
          this.isLoading = false;
          if (!res) alert('Вече съществува резервация за този часови интервал. Моля, изберете друг час.')
          else {
            this.router.navigate(['/booking/status'], {
              queryParams: { action: 'success', time: this.bookingTime, date: this.date },
            });
          }
        }, 2000);
      })
    )
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

  getVehicleCategories() {
    this.vehicleCategories$ = this.firestoreService.getVehicleCategories();
  }

  getVehicleServices() {
    this.vehicleServices$ = this.firestoreService.getServices();
  }
}
