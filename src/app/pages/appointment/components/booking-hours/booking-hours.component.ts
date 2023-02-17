import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { AddEventDialogComponent } from 'src/app/add-event-dialog/add-event-dialog.component';
import { Booking } from 'src/app/model/booking';
import { BookingService } from 'src/app/service/booking.service';


@Component({
  selector: 'app-booking-hours',
  templateUrl: './booking-hours.component.html',
  styleUrls: ['./booking-hours.component.scss']
})
export class BookingHoursComponent implements OnInit, OnChanges, OnDestroy {

  @Input() currentDate: Date | null | undefined;
  @Input() dayData$: Observable<any> = of({});
  @Input() showBookingHours: Observable<boolean> | undefined = of(true);

  bookedBookingsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  subscriptions: any[] = [];

  appState$!: Observable<{
    appState: string;
    data?: any;
    error?: HttpErrorResponse;
  }>;

  monthNames = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];
  times = ['05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30',];

  constructor(private dialog: MatDialog, private bookingService: BookingService, private formBuilder: FormBuilder) { }

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

  ngOnInit(): void {
  }

  openCreateBookingDialog(bookingTime: any) {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      data: { date: this.currentDate, bookingTime: bookingTime, numberOfBookedBookings: this.bookedBookingsSubject.value.length }
      , maxHeight: '90vh'
    })
  }

  isBookingHourBooked(bookingHour: string): boolean {
    return this.bookedBookingsSubject.value.includes(bookingHour);
  }

  closeBookingHours() {
    this.showBookingHours = of(false);
  }
}
