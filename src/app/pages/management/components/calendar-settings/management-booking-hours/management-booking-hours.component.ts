import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { Booking } from 'src/app/model/booking';
import { BookingService } from 'src/app/service/booking.service';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';

@Component({
  selector: 'app-management-booking-hours',
  templateUrl: './management-booking-hours.component.html',
  styleUrls: ['./management-booking-hours.component.scss']
})
export class ManagementBookingHoursComponent implements OnInit, OnChanges, OnDestroy {

  @Input() currentDate: Date | null | undefined;
  @Input() dayData$: Observable<any> = of({});
  @Input() showBookingHours: Observable<boolean> | undefined = of(true);

  @Output() changes = new EventEmitter();

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

  selectedItems: string[] = [];

  onCheckboxChange(event: any): void {
    if (event.target.checked) {
      this.selectedItems.push(event.target.value);
      this.selectedItems.sort((a: string, b: string) => {
        const timeA: number = parseInt(a.split(":")[0]) * 60 + parseInt(a.split(":")[1]);
        const timeB: number = parseInt(b.split(":")[0]) * 60 + parseInt(b.split(":")[1]);
        return timeA - timeB;
      });
    } else {
      const index = this.selectedItems.indexOf(event.target.value, 0);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      }
    }
  }

  constructor(private dialog: MatDialog, private bookingService: BookingService, private formBuilder: FormBuilder, private router: Router) { }

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

  setDayAsNotWorkDay() {
    this.bookingService.setDayAsNotWorkDay(this.currentDate!);
    this.changes.emit();
  }

  setDayAsWorkDay() {
    this.bookingService.setDayAsWorkDay(this.currentDate!);
    this.changes.emit();
  }

  setBookingHours() {
    this.bookingService.setBookingHours(this.currentDate!, this.selectedItems);
    this.changes.emit();
  }

}

