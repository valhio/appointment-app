import { Component, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, switchMap, of } from 'rxjs';
import { Booking } from 'src/app/model/booking';
import { BookingService } from 'src/app/service/booking.service';
import { FirestoreService } from 'src/app/service/firestore-service.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent {

  @Input() date: Date | undefined;
  @Input() bookingTime: string | null | undefined = '';

  monthNames = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    registrationNumber: new FormControl('', Validators.required),
    bookingType: new FormControl('', Validators.required),
    vehicleCategory: new FormControl('', Validators.required),
  })

  userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public isLoading = false;
  submitted = false;
  subscriptions: Subscription[] = [];

  vehicleCategories$: any = null;
  vehicleServices$: any = null;

  constructor(
    private db: AngularFirestore,
    private bookingService: BookingService,
    private router: Router,
    private firestoreService: FirestoreService,
    private afAuth: AngularFireAuth,
  ) {
    this.afAuth.user.subscribe(user => {
      this.userSubject.next(user ? user : null);      
    });
  }

  ngOnInit(): void {
    this.getVehicleCategories()
    this.getVehicleServices()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

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
      createdBy: this.userSubject.value ? this.userSubject.value.email : 'guest',
      userId: this.userSubject.value ? this.userSubject.value.uid :  'guest',
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
                      bookedHoursCount = bookedHoursCount && bookedHoursCount>0 ? bookedHoursCount : 0; // If bookedHoursCount is null/undefined/NaN or negative value, set it to 0
                      // bookedHoursCount = bookedHoursCount || 0; // If bookedHoursCount is null/undefined/NaN, set it to 0
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
