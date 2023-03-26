import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject, map, startWith, catchError } from 'rxjs';
import { Booking } from 'src/app/model/booking';
import { AddEventDialogComponent } from 'src/app/pages/management/components/calendar-settings/add-event-dialog/add-event-dialog.component';
import { BookingService } from 'src/app/service/booking.service';

@Component({
  selector: 'app-new-calendar-footer',
  templateUrl: './new-calendar-footer.component.html',
  styleUrls: ['./new-calendar-footer.component.scss']
})
export class NewCalendarFooterComponent {

  @Input() currentDate: Date | null | undefined;
  @Input() dayData$: Observable<any> = of(null);
  @Input() showBookingHours: Observable<boolean> | undefined = of(true);

  @Output() changes = new EventEmitter();
  @Output() bookingTimeSelected = new EventEmitter();

  user$?: Observable<any> = this.afAuth.user;

  bookedBookingsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  subscriptions: any[] = [];

  appState$!: Observable<{
    appState: string;
    data?: any;
    // bookedBookings?: string[];
    error?: HttpErrorResponse;
  }>;

  monthNames = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];
  times = ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30'];

  constructor(private dialog: MatDialog, private bookingService: BookingService, private formBuilder: FormBuilder, private router: Router, private afAuth: AngularFireAuth) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.appState$ = this.bookingService.getBookingsForDate(this.currentDate!).pipe(
      map(response => {
        this.bookedBookingsSubject.next(response.map((booking: Booking) => booking.bookingTime));
        return { appState: 'APP_LOADED', }
      }),
      startWith({ appState: 'APP_LOADING' }),
      catchError(error => of({ appState: 'APP_ERROR', error }))
    )
  }

  openCreateBookingDialog(bookingTime: any) {
    this.subscriptions.push(
      this.dialog.open(AddEventDialogComponent, {
        data: { date: this.currentDate, bookingTime: bookingTime, numberOfBookedBookings: this.bookedBookingsSubject.value.length }
        , maxHeight: '90vh'
      }).afterClosed().subscribe(result => {
        this.changes.emit(); // emit changes to parent component to reload the calendar data and update the bookings list for the currently selected date
      })
    )
  }

  isBookingHourBooked(bookingHour: string): boolean {
    return this.bookedBookingsSubject.value.includes(bookingHour);
  }

  closeBookingHours() {
    this.showBookingHours = of(false);
  }

  onBookingTimeSelect(time: string) {
    this.bookingTimeSelected.emit(time);
  }

}
