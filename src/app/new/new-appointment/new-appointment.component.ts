import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.scss']
})
export class NewAppointmentComponent {
  readonly tabs: string[] = ['date-settings', 'booking-form', 'notifications'];
  activeTab = 'calendar'

  user$ = this.afAuth.user;

  constructor(private afAuth: AngularFireAuth) {}

  logout(): void {
    this.afAuth.signOut();
  }
}
