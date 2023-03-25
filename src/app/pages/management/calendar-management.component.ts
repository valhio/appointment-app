import { Component } from '@angular/core';
import 'firebase/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-calendar-management',
  templateUrl: './calendar-management.component.html',
  styleUrls: ['./calendar-management.component.scss']
})
export class CalendarManagementComponent {

  readonly tabs: string[] = ['date-settings', 'booking-form', 'notifications'];
  activeTab = 'calendar-settings'

  constructor(private afAuth: AngularFireAuth){}
  
  logout(): void {
    this.afAuth.signOut();
  }
}
