import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import 'firebase/database';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BookingService } from 'src/app/service/booking.service';
import { AddEventDialogComponent } from 'src/app/add-event-dialog/add-event-dialog.component';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent {
  private dateRef: AngularFirestoreDocument<any> | undefined;
  numberOfBookedBookings: number = 0;
  isWorkDay: boolean | null = null;

  public calendar: any = [];
  public showBookingHours: Observable<boolean> | undefined = of(true);
  private currentNumberOfBookings: number = 0;

  private subscriptions: Subscription[] = [];
  destroy$ = new Subject<boolean>();

  private selectedDateSubject = new BehaviorSubject<Date>(new Date());
  readonly selectedDate$ = this.selectedDateSubject.asObservable();

  bookingsForSelectedDateSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  bookingsForSelectedDate$ = this.bookingsForSelectedDateSubject.asObservable();

  constructor(private http: HttpClient, private db: AngularFirestore, private dialog: MatDialog, private router: Router, private bookingService: BookingService) {
  }

  public readonly monthNames = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];
  public days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  bookingHours = [] as any;

  ngOnInit(): void {
    this.generateCalendar()
    this.bookingHours = this.bookingService.getDefaultBookingHours();
    // this.getBookingHoursFromDb()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private generateCalendar(): void {
    this.generateCalendarDays()
    this.generateAllBookedDays()
    this.generateDataForCurrentDate();
  }

  private getStartDateForCalendar(selectedDate: Date) {
    // This variable will hold the last day of the previous month.
    let lastDayOfPreviousMonth = new Date(selectedDate.setDate(0));

    // This variable will hold the first day of the calendar.
    let startingDateOfCalendar: Date = lastDayOfPreviousMonth;

    // If the day is not Monday, we will go back in days until we find the last Monday of previous month.
    if (startingDateOfCalendar.getDay() != 1) {
      do {
        startingDateOfCalendar = new Date(startingDateOfCalendar.setDate(startingDateOfCalendar.getDate() - 1));
      } while (startingDateOfCalendar.getDay() != 1);
    }

    // Now that we have the first day of the calendar, we can return it.
    return startingDateOfCalendar;
  }

  private generateCalendarDays(): void {
    // The calendar array will hold all the days that we need to show in our calendar.
    // We need to clear it every time we generate a new calendar, because we don't want to have the days from the previous calendar.
    this.calendar = [];

    // The day variable is set to the selected date.
    let day: Date = new Date(this.selectedDateSubject.value);

    // Here, first day that our calendar will start from, is found.
    // That would be the last Monday of the previous month.
    let startingDateOfCalendar = this.getStartDateForCalendar(day);

    // This is the date that we will add to our calendar array. It will be incremented by 1 day each time in the following loop.
    let dateToAdd = startingDateOfCalendar;

    // This loop will run 42 times, which is the number of days we need to show in our calendar.
    // The reason we need to show 6 weeks is because we want to show the days of the previous and next month as well.
    // Without this, the calendar will only show the days of the current month and it will look weird.
    for (var i = 0; i < 42; i++) {
      this.calendar.push({ day: new Date(dateToAdd) });
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }
  }

  generateAllBookedDays() {
    this.subscriptions.push(
      this.bookingService.getBookingsForMonth(this.selectedDateSubject.value) // Get all bookings for the selected month
        .subscribe(snapshot => {
          snapshot.docs
            .filter(doc => doc.data()['numberOfBookedBookings'] >= this.bookingHours.length) // Filter only fully booked days
            .map(doc => doc.id) // Get the id of the fully booked days
            .map(id => this.calendar.find((day: any) => day.day.getDate() == id).fullyBooked = true) // Set the fullyBooked property to true for the fully booked days
        })
    )

    this.subscriptions.push(
      this.bookingService.getBookingsForMonth(this.selectedDateSubject.value) // Get all bookings for the selected month
        .subscribe(snapshot => {
          snapshot.docs
            .filter(doc => doc.data()['isWorkDay'] != null)
            .forEach(doc => {
              this.calendar.find((day: any) => day.day.getDate() == doc.id).isWorkDay = doc.data()['isWorkDay']
            }) // Set the fullyBooked property to true for the fully booked days
        })
    )
  }

  generateDataForCurrentDate(): void {
    this.dateRef = this.bookingService.getDayRef(this.selectedDateSubject.value);
    this.subscriptions.push(
      this.dateRef.collection('data').get().subscribe(querySnapshot => {
        this.numberOfBookedBookings = querySnapshot.docs.length;
        this.bookingsForSelectedDateSubject.next(querySnapshot.docs.map(doc => doc.data()));
      })
    )

    this.subscriptions.push(
      this.bookingService.isWorkDay(this.selectedDateSubject.value).subscribe(isWorkDay => {
        this.isWorkDay = isWorkDay ? isWorkDay : null;
      })
    )
  }

  onShowBookingHours(status: boolean) {
    this.showBookingHours = of(status);
  }

  onNavigateNextMonth() {
    this.selectedDateSubject.next(
      new Date(this.selectedDateSubject.value.setMonth(this.selectedDateSubject.value.getMonth() + 1))
    );
    this.generateCalendar();
  }

  onNavigatePreviousMonth() {
    // Do not allow users to navigate to previous months, when the current month and year are selected
    if (this.selectedDateSubject.value.getMonth() <= new Date().getMonth() && this.selectedDateSubject.value.getFullYear() <= new Date().getFullYear()) return

    this.selectedDateSubject.next(
      new Date(this.selectedDateSubject.value.setMonth(this.selectedDateSubject.value.getMonth() - 1))
    )
    this.generateCalendar();
  }

  onChangeSelectedDate(date: Date) {
    this.selectedDateSubject.next(date);
    this.generateCalendar();
  }

  deleteBooking(date: Date, bookingId: string) {
    // Because we need to update the number of booked bookings, we need to check if the booking exists first. 
    // Otherwise if some error happens and we send a booking id that does not exist (for example - undefined), the number of booked bookings will be decreased by 1, even though the booking was not deleted (because it does not exist).
    // After that, we are going to have a problem, because the number of booked bookings will be less than the actual number of booked bookings.
    // To avoid this, we first check if the booking exists, and if it does, we delete it and then update the number of booked bookings.
    this.bookingService.getBookingByBookingTime(date, bookingId).subscribe((res: any) => { // Get the booking by booking time
      if (res.exists) { // If the booking exists, delete it
        this.bookingService.deleteBookingById(date, res.id) // Delete the booking
          .then(() => {
            this.bookingService.getNumberOfBookedBookings(date).subscribe((res: any) => { // Get the number of booked bookings for the selected date
              this.currentNumberOfBookings = res - 1; // Decrease the number of booked bookings by 1
              this.bookingService.updateNumberOfBookedBookings(date, this.currentNumberOfBookings); // Update the number of booked bookings for the selected date
              this.generateCalendar(); // Generate the calendar again, so that the number of booked bookings will be updated
            });
          })
          .catch(err => console.log(err))
      } else {
        console.log('Booking does not exist')
      }
    })
  }

  updateBookingDialog(bookingId: string, booking: any) {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      data: { date: this.selectedDateSubject.value, numberOfBookedBookings: this.currentNumberOfBookings, }
      , maxHeight: '90vh'
    })
  }
}
