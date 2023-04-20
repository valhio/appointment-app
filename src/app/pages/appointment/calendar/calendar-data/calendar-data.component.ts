import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { BookingService } from 'src/app/service/booking.service';
import { Observable, Subscription, BehaviorSubject, of } from 'rxjs';
import { Booking } from 'src/app/model/booking';

@Component({
  selector: 'app-calendar-data',
  templateUrl: './calendar-data.component.html',
  styleUrls: ['./calendar-data.component.scss']
})
export class CalendarDataComponent implements OnDestroy {

  @Input() bookings: Booking[] = [];
  @Input() date: Date | null = null;

  @Output() changes = new EventEmitter();

  subscriptions: Subscription[] = [];

  constructor(private bookingService: BookingService) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  updateBookingDialog(bookingId: string, booking: any) {
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
                let newCount = res && res > 0 ? res - 1 : 0; // Decrease the number of booked bookings by 1
                this.bookingService.updateNumberOfBookedBookings(date, newCount); // Update the number of booked bookings for the selected date
                this.changes.emit(); // Emit changes to the parent component 
              });
            })
            .catch(err => console.log(err))
        } else {
          console.log('Booking does not exist')
        }
      })
    )
  }
}
