import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.scss']
})
export class BookingStatusComponent {
  bookingStatus: string = '';
  bookingTime: string | undefined = undefined;
  bookingDate: Date | undefined = undefined;

  monthNames = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];

  constructor(private activatedRoute: ActivatedRoute) {
    this.bookingTime = this.activatedRoute.snapshot.queryParamMap.get('time') || undefined;
    this.bookingDate = new Date(this.activatedRoute.snapshot.queryParamMap.get('date')!) || undefined;

    this.bookingStatus = this.getBookingStatus();
  }

  getBookingStatus(): string {
    let action = this.activatedRoute.snapshot.queryParamMap.get('action');

    if (action && (action === 'success' || action === 'failure' || action === 'cancel')) {
      return action;
    }
    return ''
  }
}
