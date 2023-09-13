import { Component, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, Observable, of } from 'rxjs';
import { VehicleCategoryEnum } from 'src/app/enum/vehicle-category';
import { Booking } from 'src/app/model/booking';
import { BookingService } from 'src/app/service/booking.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {


  public readonly monthNames = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];
  public readonly days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  private subscriptions: Subscription[] = [];
  public activeTab = 'calendar-data'

  user$ = this.afAuth.user;

  defaultBookingHoursSubject = new BehaviorSubject<any>([]);

  public calendar: any = [];

  public showBookingHours: Observable<boolean> | undefined = of(true);

  private selectedDateSubject = new BehaviorSubject<Date>(new Date());
  selectedDate$ = this.selectedDateSubject.asObservable(); // This is the currently selected date from the calendar.

  currentDateDataSubject = new BehaviorSubject<any>(null);
  currentDateData$ = this.currentDateDataSubject.asObservable(); // This is the data for the currently selected date. Includes the bookings, the booking hours, is it a work day, is it fully booked, etc. for the currently selected date.

  bookingTimeSubject = new BehaviorSubject<string | null>(null);

  bookingsForSelectedDate$: Observable<Booking[]> = of([]);

  constructor(private bookingService: BookingService, private afAuth: AngularFireAuth) {
  }


  ngOnInit() {

    this.subscriptions.push(
      this.bookingService.getDefaultBookingHours().subscribe(defaultBookingHours => {
        this.defaultBookingHoursSubject.next(defaultBookingHours);
        this.generateCalendar();
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private async generateCalendar(): Promise<void> {
    this.generateCalendarDays() // Generate the days for the calendar
    this.generateCalendarData(); // Generate the data for the calendar. This includes the bookings, the booking hours, is it a work day, is it fully booked, etc. for each day contained in the db.
    this.setCurrentDateData(); // Set the data for the currently selected date.
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
              const bookingHours = doc.data()['bookingHours'] ? doc.data()['bookingHours'] : this.defaultBookingHoursSubject.value // Get all available booking hours for the day
              const isWorkDay = doc.data()['isWorkDay'] != undefined ? doc.data()['isWorkDay'] : true // Get the isWorkDay property(field) for the day, if it is null, set it to true by default
              const isFullyBooked = numberOfBookedBookings >= bookingHours.length // Check if the day is fully booked
              return { day: doc.id, numberOfBookedBookings, bookingHours, isWorkDay, isFullyBooked } // Return the data for the day
            })
            .forEach(dayData => {
              // Search the calendar for the day that matches the dayData.day and the selected month. 
              // If not checked by the month, the first matching day will be returned, which is not what we want (for example, when not checking month, if we have 27th of last month and 27th of this month, the first 27th will be returned which is not what we want)          
              const day = this.calendar.find((day: any) => day.day.getDate() == dayData.day && day.day.getMonth() == this.selectedDateSubject.value.getMonth())
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
    })
  }

  setCurrentDateData() {
    let day = this.calendar.find((day: any) => day.day.getDate() == this.selectedDateSubject.value.getDate() && day.day.getMonth() == this.selectedDateSubject.value.getMonth()) // Search the calendar for the day
    if (!day) return // Safety check (should never happen, but just in case)
    day.numberOfBookedBookings != undefined ? day.numberOfBookedBookings : day.numberOfBookedBookings = 0 // If the number of booked bookings is undefined, set it to 0 (default value). If the property is defined, do nothing
    day.bookingHours != undefined ? day.bookingHours : day.bookingHours = this.defaultBookingHoursSubject.value // If the available booking hours are undefined, set them to the default booking hours. If the property is defined, do nothing
    day.isWorkDay != undefined ? day.isWorkDay : (day.day.getDay() == 0 || day.day.getDay() == 6) ? day.isWorkDay = false : day.isWorkDay = true // If the isWorkDay property is undefined, set it to true if the day is a work day (Monday - Friday), otherwise set it to false. If the property is defined, do nothing
    day.fullyBooked == undefined ? day.fullyBooked = false : day.fullyBooked
    this.currentDateDataSubject.next(day)
    this.currentDateData$ = this.currentDateDataSubject.asObservable(); // This new object assignment is needed to trigger the change detection in the calendar-footer component. NgOnChange is not triggered when the object is changed, only when the reference is changed.
  }

  onShowBookingHours(status: boolean) {
    this.showBookingHours = of(status);
  }

  onNavigatePreviousMonth() {
    // If the current date, for example, is 31st of March, and we navigate to the previous month, the new date will be 31st of February, which does not exist.
    // To fix this, if the current date does not exist in the previous month, we set the date to 1st of the current month (which is always valid), and then decrement the month by 1. (31st of March -> 31st of February = invalid -> 1st of March -> 1st of February)
    // If the previous month has the selected date, we skip this step, and just decrement the month by 1.
    let newDate: Date = new Date(this.selectedDateSubject.value);
    newDate.setMonth(this.selectedDateSubject.value.getMonth() - 1)
    if (newDate.getMonth() != this.selectedDateSubject.value.getMonth() - 1) {
      this.selectedDateSubject.value.setDate(1);
    }

    this.selectedDateSubject.next(
      new Date(this.selectedDateSubject.value.setMonth(this.selectedDateSubject.value.getMonth() - 1))
    );
    this.generateCalendar();
  }

  onNavigateNextMonth() {
    // If the current date, for example, is 31st of January, and we navigate to the next month, the new date will be 31st of February, which does not exist.
    // When 31st of January's month is incremented by 1, we expect the new date to be 31st of February, but since February has only 28 days, the new date will be the next valid month, which is March. (31st of January -> 31st of February = invalid -> 3rd of March) 
    // In such case, to fix this issue, we set the date to 1st of the current month (which is always valid), and then increment the month by 1. (31st of January -> 1st of January -> 1st of February)
    // If the next month has the current date, we skip this step, and just increment the month by 1. (24th of January -> 24th of February)
    let newDate: Date = new Date(this.selectedDateSubject.value);
    newDate.setMonth(this.selectedDateSubject.value.getMonth() + 1)
    if (newDate.getMonth() != this.selectedDateSubject.value.getMonth() + 1) { // This checks if the new month is the same as the current month + 1. If it is not, it means that the current date does not exist in the next month (the new month is going to be different(next month ) than the current month + 1).
      this.selectedDateSubject.value.setDate(1);
    }

    this.selectedDateSubject.next(
      new Date(this.selectedDateSubject.value.setMonth(this.selectedDateSubject.value.getMonth() + 1))
    );
    console.log(this.selectedDateSubject.value);
    this.generateCalendar();
  }

  onChangeSelectedDate(date: Date) {
    this.selectedDateSubject.next(date);
    this.generateCalendar();
  }

  onChanges() {
    this.generateCalendar();
  }

  onBookingTimeSelected(bookingTime: string) {
    this.bookingTimeSubject.next(bookingTime);
  }

}
