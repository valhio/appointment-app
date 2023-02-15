import {HttpErrorResponse} from '@angular/common/http';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from 'rxjs';
import { AddEventDialogComponent } from 'src/app/add-event-dialog/add-event-dialog.component';
import { BookingService } from 'src/app/service/booking.service';

@Component({
  selector: 'app-management-booking-hours',
  templateUrl: './management-booking-hours.component.html',
  styleUrls: ['./management-booking-hours.component.scss']
})
export class ManagementBookingHoursComponent {

  @Input() currentDate: Date | null | undefined;
  @Input() isWorkDay: boolean | null = null;
  @Input() bookingHours: string[] = [];
  @Input() showBookingHours: Observable<boolean> | undefined = of(true);

  bookedBookingsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  appState$!: Observable<{
    appState: string;
    bookedBookings?: string[];
    error?: HttpErrorResponse;
  }>;

  monthNames = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];

  constructor(private dialog: MatDialog, private bookingService: BookingService) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.appState$ = this.bookingService.getBookingsForDate(this.currentDate!).pipe(
      map((bookings: any) => bookings.docs.map((booking: any) => booking.id)),
      map(response => {
        this.bookedBookingsSubject.next(response);
        return { appState: 'APP_LOADED', bookedBookings: response }
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
