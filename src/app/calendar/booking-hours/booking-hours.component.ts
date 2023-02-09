import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEventDialogComponent } from 'src/app/add-event-dialog/add-event-dialog.component';

@Component({
  selector: 'app-booking-hours',
  templateUrl: './booking-hours.component.html',
  styleUrls: ['./booking-hours.component.scss']
})
export class BookingHoursComponent {

  @Input() currentDate: Date | null | undefined;
  @Input() bookingHours: string[] = [];
  @Input() bookedBookings: string[] = [];


  monthNames = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];
  showBookingHours: boolean = true;

  constructor(private dialog: MatDialog) { }

  openCreateBookingDialog(bookingTime: any) {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      data: { date: this.currentDate, bookingTime: bookingTime, numberOfBookedBookings: this.bookedBookings.length }
      , maxHeight: '90vh'
    })
  }

  isBookingHourBooked(bookingHour: string): boolean {
    return this.bookedBookings.includes(bookingHour);
  }

}
