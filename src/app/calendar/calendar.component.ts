import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, first, map, take, tap, catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import 'firebase/database';
import { BookingService } from '../service/booking.service';
import { Router } from '@angular/router';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import 'firebase/database';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
 
  private dateRef: AngularFirestoreDocument<any> | undefined;
  numberOfBookedBookings: number = 0;
  bookedBookings: string[] = [];

  public calendar: any = [];
  public showBookingHours: boolean = true;
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
    this.bookingHours = this.bookingService.getBookingHours();
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

  private generateCalendarDays(): void {
    // we reset our calendar every time
    this.calendar = [];

    // we set the date 
    let day: Date = new Date(this.selectedDateSubject.value);

    // here we find the first day that our calendar will start from
    // it would be the last Monday of the previous month
    let startingDateOfCalendar = this.getStartDateForCalendar(day);

    // dateToAdd is an intermediate variable that will get increased in the following for loop
    let dateToAdd = startingDateOfCalendar;

    // since we have our starting date, then we get the next 41 days 
    // that we need to add in our calendar array
    // 41 cause our calendar will show 6 weeks and 6 weeks * 7 days = 42
    for (var i = 0; i < 42; i++) {
      this.calendar.push({ day: new Date(dateToAdd) });
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }
  }

  private getStartDateForCalendar(selectedDate: Date) {
    // for the day we selected let's get the previous month last day
    let lastDayOfPreviousMonth = new Date(selectedDate.setDate(0));

    // start by setting the starting date of the calendar same as the last day of previous month
    let startingDateOfCalendar: Date = lastDayOfPreviousMonth;

    // but since we actually want to find the last Monday of previous month
    // we will start going back in days intil we encounter our last Monday of previous month
    if (startingDateOfCalendar.getDay() != 1) {
      do {
        startingDateOfCalendar = new Date(startingDateOfCalendar.setDate(startingDateOfCalendar.getDate() - 1));
      } while (startingDateOfCalendar.getDay() != 1);
    }

    return startingDateOfCalendar;
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
  }
  
  generateDataForCurrentDate(): void {    
    this.dateRef = this.bookingService.getDayRef(this.selectedDateSubject.value);
    this.dateRef.collection('data').get().subscribe(querySnapshot => {
      this.numberOfBookedBookings = querySnapshot.docs.length;
      this.bookedBookings = querySnapshot.docs.map(doc => doc.id);
      this.bookingsForSelectedDateSubject.next(querySnapshot.docs.map(doc => doc.data()));
    })
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
    let deleted = false;
    this.bookingService.deleteBookingById(date, bookingId)
      .then(function () {
        deleted = true;
      })
      .finally(() => {
        if (deleted) {
          this.bookingService.getNumberOfBookedBookings(date).subscribe((res: any) => {
            this.currentNumberOfBookings = res - 1;
            this.bookingService.updateNumberOfBookedBookings(date, this.currentNumberOfBookings);
            this.generateCalendar();
          });
        }
      });
  }

  updateBookingDialog(bookingId: string, booking: any) {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      data: { date: this.selectedDateSubject.value, numberOfBookedBookings: this.currentNumberOfBookings, }
      , maxHeight: '90vh'
    })
  }

}