import { Component, OnDestroy, OnInit, NgModule } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import 'firebase/database';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BookingService } from 'src/app/service/booking.service';
import { AddEventDialogComponent } from 'src/app/pages/management/components/calendar-settings/add-event-dialog/add-event-dialog.component';
import { Booking } from 'src/app/model/booking';
import { VehicleCategoryEnum } from '../../enum/vehicle-category';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from '../../service/firestore-service.service';

@Component({
  selector: 'app-calendar-management',
  templateUrl: './calendar-management.component.html',
  styleUrls: ['./calendar-management.component.scss']
})
export class CalendarManagementComponent {

  readonly tabs: string[] = ['date-settings', 'booking-form', 'notifications'];
  activeTab = 'calendar-settings'

  constructor(private afAuth: AngularFireAuth){
    // Get the email of the user
    this.afAuth.user.subscribe(user => {
      if (user) {
        console.log(user.email);
      }
    });    
  }
  
  logout(): void {
    this.afAuth.signOut();
  }
}
