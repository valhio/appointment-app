import { Component, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, BehaviorSubject, switchMap, of, tap, map, Observable } from 'rxjs';
import { Booking } from 'src/app/model/booking';
import { BookingService } from 'src/app/service/booking.service';
import { FirestoreService } from 'src/app/service/firestore-service.service';

@Component({
  selector: 'app-add-booking-modal',
  templateUrl: './add-booking-modal.component.html',
  styleUrls: ['./add-booking-modal.component.scss']
})
export class AddBookingModalComponent {
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
  selectedAdditionalServices: string[] = [];

  readonly bookingFormData$: Observable<{
    vehicleCategories: string[],
    services: string[],
    additionalServices: string[]
  }> = this.firestoreService.getSystemBookingFormData().pipe(
    map((doc: any) => {
      return {
        vehicleCategories: doc.data()['categories'] as string[],
        services: doc.data()['services'] as string[],
        additionalServices: doc.data()['additionalServices'] as string[],
      }
    })
  )

  userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private dialogRef: MatDialogRef<AddBookingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      date: Date,
      bookingTime: string,
      numberOfBookedBookings: number,
    },
    private db: AngularFirestore,
    private bookingService: BookingService,
    private firestoreService: FirestoreService,
    private afAuth: AngularFireAuth,
  ) {
    this.afAuth.user.subscribe(user => {
      this.userSubject.next(user ? user : null);
    });
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
      createdBy: this.userSubject.value ? this.userSubject.value.email : 'guest',
      userId: this.userSubject.value ? this.userSubject.value.uid : 'guest',
      additionalServices: this.selectedAdditionalServices,
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
                      bookedHoursCount = bookedHoursCount || 0; // If bookedHoursCount is null/undefined/NaN, set it to 0
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

  checkValue(event: any) {
    if (event.target.checked) {
      this.selectedAdditionalServices.push(event.target.value);
    } else {
      this.selectedAdditionalServices = this.selectedAdditionalServices.filter(item => item !== event.target.value);
    }
  }
}
