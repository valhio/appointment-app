import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarManagementComponent } from './components/management/calendar-management/calendar-management.component';
import { AppointmentComponent } from './components/home/appointment/appointment.component';

const routes: Routes = [
  {path: '', component: CalendarComponent},
  {path: 'home', component: CalendarComponent},
  {path: 'management', component: CalendarManagementComponent},
  {path: 'appointment', component: AppointmentComponent},
  {path: '**', redirectTo: '/home', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
