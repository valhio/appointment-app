import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent {
  readonly tabs: string[] = ['date-settings', 'booking-form', 'notifications'];
  activeTab = 'calendar'

  user$ = this.afAuth.user;

  constructor(private afAuth: AngularFireAuth) {}

  logout(): void {
    this.afAuth.signOut();
  }
}
