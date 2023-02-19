import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.scss']
})
export class BookingStatusComponent {
  bookingStatus: string = '';
  
  constructor(private activatedRoute: ActivatedRoute){
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
