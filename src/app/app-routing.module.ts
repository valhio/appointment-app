import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import CalendarTwoComponent from './calendar-two/calendar-two.component';

const routes: Routes = [
  {path: '', component: CalendarComponent},
  {path: 'home', component: CalendarComponent},
  {path: 'sec', component: CalendarTwoComponent},
  {path: '**', redirectTo: '/home', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
