import { Component } from '@angular/core';
import { of, BehaviorSubject, tap, map } from 'rxjs';
import { BookingService } from 'src/app/service/booking.service';
import { FirestoreService } from '../../../../service/firestore-service.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateSystemSettingsComponent } from './update-system-settings/update-system-settings.component';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent {

  times = ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30','05:00', '05:30'];
  selectedItems: string[] = [];

  defaultBookingHours$ = this.bookingService.getDefaultBookingHours();
  systemSettings$ = this.firestoreService.getSystemSettings().pipe(
    tap((value: any) => {
      this.systemSettingsSubject.next(value);
    })
  )
  systemSettingsSubject: BehaviorSubject<any> = new BehaviorSubject<any>({ maps: [], workHours: [], phone: '' });

  constructor(private bookingService: BookingService, private firestoreService: FirestoreService, private dialog: MatDialog) { }

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

  openEditDialog(string: string[], toUpdate: string) {
    this.dialog.open(UpdateSystemSettingsComponent, {
      data: { value: string, toUpdate: toUpdate },
      width: '90%',
      maxWidth: '500px'
    }).afterClosed().subscribe((value: string[]) => {
      if (value) {
        if (toUpdate === 'maps') {
          this.systemSettingsSubject.value['maps'] = value;
        }else if (toUpdate === 'workHours') {
          this.systemSettingsSubject.value['workHours'] = value;
        }else if (toUpdate === 'phone') {
          this.systemSettingsSubject.value['phone'] = value[0];
        }

        this.firestoreService.updateSystemSettings(this.systemSettingsSubject.value);
        this.systemSettings$ = of(this.systemSettingsSubject.value);
      }
    })
  }
}
