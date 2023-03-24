import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Booking } from '../../../../../model/booking';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BookingType } from '../../../../../enum/booking-type';
import { Subscription, map, switchMap, forkJoin, of } from 'rxjs';
import { BookingService } from '../../../../../service/booking.service';
import { FirestoreService } from '../../../../../service/firestore-service.service';

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrls: ['./add-event-dialog.component.scss']
})
export class AddEventDialogComponent implements OnDestroy {
  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    registrationNumber: new FormControl('', Validators.required),
    bookingType: new FormControl('', Validators.required),
    vehicleCategory: new FormControl('', Validators.required),
  })

  public isLoading = false;
  submitted = false;
  subscriptions: Subscription[] = [];

  readonly categories$ = this.firestoreService.getVehicleCategories();
  readonly services$ = this.firestoreService.getServices();

  constructor(
    private dialogRef: MatDialogRef<AddEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      date: Date,
      bookingTime: string,
      numberOfBookedBookings: number,
    },
    private db: AngularFirestore,
    private bookingService: BookingService,
    private firestoreService : FirestoreService
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

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


    this.subscriptions.push(
      // First check if booking exists. If it does, return false. If it doesn't, create booking.
      // If booking was not created, return false. If it was, get number of booked bookings for that day.
      // Once we have the number of booked bookings, update the number of booked bookings for that day.
      this.bookingService.getBookingByBookingTime(this.data.date!, this.data.bookingTime!).pipe( // Get booking by booking time
        switchMap(querySnapshot => {
          if (!querySnapshot.exists) { // If booking does not exist, create it. Otherwise, return false.
            return this.bookingService.addBooking(booking as Booking).pipe( // Create booking
              switchMap(added => {
                if (added) { // If booking was created, get number of booked bookings for that day. Otherwise, return false.
                  return this.bookingService.getNumberOfBookedBookings(this.data.date!).pipe( // Get number of booked bookings for that day
                    switchMap(bookedHoursCount => {
                      bookedHoursCount = bookedHoursCount || 0; // If bookedHoursCount is null/undefined, set it to 0
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
        this.isLoading = false;
        this.dialogRef.close();
        if (!res) alert('Вече съществува резервация за този часови интервал. Моля, изберете друг час.')
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

}
