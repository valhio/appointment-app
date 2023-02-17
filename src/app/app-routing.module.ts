import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentComponent } from './pages/appointment/appointment.component';
import { HomeComponent } from './pages/home/home.component';
import { CalendarManagementComponent } from './pages/management/calendar-management.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'management', component: CalendarManagementComponent},
  {path: 'appointment', component: AppointmentComponent},
  {path: '**', redirectTo: '/home', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
