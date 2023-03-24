import { Component } from '@angular/core';
import { of } from 'rxjs';
import { BookingService } from 'src/app/service/booking.service';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent {

  times = ['05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30',];
  selectedItems: string[] = [];

  defaultBookingHours$ = this.bookingService.getDefaultBookingHours();

  constructor(private bookingService: BookingService) { }

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

  updateDefaultBookingHours(): void {
    this.bookingService.updateDefaultBookingHours(this.selectedItems);
    this.defaultBookingHours$ = of(Array.from(this.selectedItems));
  }
}