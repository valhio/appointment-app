import { Component, OnDestroy, OnInit, NgModule } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import 'firebase/database';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BookingService } from 'src/app/service/booking.service';
import { AddEventDialogComponent } from 'src/app/add-event-dialog/add-event-dialog.component';
import { Booking } from 'src/app/model/booking';
import { VehicleCategoryEnum } from '../../enum/vehicle-category';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from '../../service/firestore-service.service';

@Component({
  selector: 'app-calendar-management',
  templateUrl: './calendar-management.component.html',
  styleUrls: ['./calendar-management.component.scss']
})
export class CalendarManagementComponent {
  public readonly monthNames = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];
  public readonly days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  readonly tabs: string[] = ['date-settings', 'booking-form', 'notifications'];
  activeTab = this.tabs[0];


  public defaultBookingHours = this.bookingService.getDefaultBookingHours();
  public calendar: any = [];
  private subscriptions: Subscription[] = [];

  public showBookingHours: Observable<boolean> | undefined = of(true);

  private selectedDateSubject = new BehaviorSubject<Date>(new Date());
  readonly selectedDate$ = this.selectedDateSubject.asObservable();

  currentDateDataSubject = new BehaviorSubject<any>(null);
  currentDateData$ = this.currentDateDataSubject.asObservable();

  bookingsForSelectedDate$ = new Observable<Booking[]>();

  constructor(private dialog: MatDialog, private router: Router, private bookingService: BookingService, private afAuth: AngularFireAuth) {
  }


  ngOnInit(): void {
    this.generateCalendar();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private async generateCalendar(): Promise<void> {
    this.generateCalendarDays()
    this.generateCalendarData();
    this.setCurrentDateData();
    this.bookingsForSelectedDate$ = this.bookingService.getBookingsForDate(this.selectedDateSubject.value);
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

  generateCalendarData() {
    this.subscriptions.push(
      this.bookingService.getBookingsForMonth(this.selectedDateSubject.value) // Get all bookings for the selected month
        .subscribe(snapshot => {
          snapshot.docs
            .map(doc => {
              const numberOfBookedBookings = doc.data()['numberOfBookedBookings'] ? doc.data()['numberOfBookedBookings'] : 0 // Get the number of booked bookings for the day
              const bookingHours = doc.data()['bookingHours'] ? doc.data()['bookingHours'] : this.defaultBookingHours // Get all available booking hours for the day
              const isWorkDay = doc.data()['isWorkDay'] != undefined ? doc.data()['isWorkDay'] : true // Get the isWorkDay property(field) for the day, if it is null, set it to true by default
              const isFullyBooked = numberOfBookedBookings >= bookingHours.length // Check if the day is fully booked
              return { day: doc.id, numberOfBookedBookings, bookingHours, isWorkDay, isFullyBooked } // Return the data for the day
            })
            .forEach(dayData => {
              const day = this.calendar.find((day: any) => day.day.getDate() == dayData.day) // Search the calendar for the day
              day.numberOfBookedBookings = dayData.numberOfBookedBookings // Set the number of booked bookings for the day
              day.bookingHours = dayData.bookingHours // Set the available booking hours for the day
              day.isWorkDay = dayData.isWorkDay // Set the isWorkDay property to true/false for the days that are work days or not
              day.isFullyBooked = dayData.isFullyBooked // Set the isFullyBooked property to true for the fully booked days
            })
        })
    )

    // Set the isWorkDay property to true/false for the days that don't have the isWorkDay property set
    this.calendar.forEach((day: any) => {
      if (day.isWorkDay == undefined) { // If the isWorkDay property does not exist
        if (day.day.getDay() == 0 || day.day.getDay() == 6) day.isWorkDay = false; // If the day is Saturday or Sunday, set the isWorkDay property to false
        else day.isWorkDay = true; // If the day is not Saturday or Sunday, set the isWorkDay property to true
      }
      // // TODO: Remove this workaround when calendar component has an Appstate (LOADED, LOADING, ERROR)================================================================================================================================================================================================================================================================================== 
      // // If the day is a work day, set the available booking hours to an empty array. 
      // // In production, when the "make appointment" button, from the home page, is clicked, if the current day is a non-work day, the available booking hours, for some reason, are not hidden. 
      // // So as a workaround, I set the available booking hours to an empty array. Now even if the booking hours are not hidden, the user can't select any of them, because there are no booking hours to select.
      // if(day.isWorkDay){
      //   day.bookingHours = []; 
      // }
    })
  }

  setCurrentDateData() {
    let day = this.calendar.find((day: any) => day.day.getDate() == this.selectedDateSubject.value.getDate()) // Search the calendar for the day
    if (!day) return // Safety check (should never happen, but just in case)
    day.numberOfBookedBookings != undefined ? day.numberOfBookedBookings : day.numberOfBookedBookings = 0 // If the number of booked bookings is undefined, set it to 0 (default value). If the property is defined, do nothing
    day.bookingHours != undefined ? day.bookingHours : day.bookingHours = this.defaultBookingHours // If the available booking hours are undefined, set them to the default booking hours. If the property is defined, do nothing
    day.isWorkDay != undefined ? day.isWorkDay : (day.day.getDay() == 0 || day.day.getDay() == 6) ? day.isWorkDay = false : day.isWorkDay = true // If the isWorkDay property is undefined, set it to true if the day is a work day (Monday - Friday), otherwise set it to false. If the property is defined, do nothing
    day.fullyBooked == undefined ? day.fullyBooked = false : day.fullyBooked
    this.currentDateDataSubject.next(day)
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
    this.subscriptions.push(
      this.bookingService.getBookingByBookingTime(date, bookingId).subscribe((res: any) => { // Get the booking by booking time
        if (res.exists) { // If the booking exists, delete it
          this.bookingService.deleteBookingById(date, res.id) // Delete the booking
            .then(() => {
              this.bookingService.getNumberOfBookedBookings(date).subscribe((res: any) => { // Get the number of booked bookings for the selected date
                let newCount = res - 1; // Decrease the number of booked bookings by 1
                this.bookingService.updateNumberOfBookedBookings(date, newCount); // Update the number of booked bookings for the selected date
                this.generateCalendar(); // Generate the calendar again, so that the number of booked bookings will be updated
              });
            })
            .catch(err => console.log(err))
        } else {
          console.log('Booking does not exist')
        }
      })
    )
  }

  updateBookingDialog(bookingId: string, booking: any) {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      data: { date: this.selectedDateSubject.value, numberOfBookedBookings: this.calendar.find((day: any) => day.day.getDate() == this.selectedDateSubject.value.getDate()).numberOfBookedBookings }
      , maxHeight: '90vh'
    })
  }

  onChanges() {
    this.generateCalendar();
  }

  getCategory(category: string): string {
    return VehicleCategoryEnum[category as keyof typeof VehicleCategoryEnum];
  }

  logout(): void {
    this.afAuth.signOut();
  }

}
