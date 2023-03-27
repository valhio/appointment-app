import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BookingStatusComponent } from './pages/booking-status/booking-status.component';
import { AuthGuard } from './service/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { NewAppointmentComponent } from './new/new-appointment/new-appointment.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  // { path: 'management', component: CalendarManagementComponent, canActivate: [AuthGuard] },
  // { path: 'appointment', component: AppointmentComponent },
  { path: 'booking/status', component: BookingStatusComponent },
  
  { path: 'new/appointment', component: NewAppointmentComponent },

  { path: '**', redirectTo: '/home', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
