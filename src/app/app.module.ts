import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { CalendarComponent } from './calendar/calendar.component';
import { ChunkPipe } from './chunk.pipe';
import { TestCalendarComponent } from './test-calendar/test-calendar.component';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from "../environments/environment";
import { CalendarHeaderComponent } from './calendar/calendar-header/calendar-header.component';
import { CalendarBodyComponent } from './calendar/calendar-body/calendar-body.component';
import { BookingHoursComponent } from './calendar/booking-hours/booking-hours.component';
import { HeaderComponent } from './components/header/header.component';
import { CalendarManagementComponent } from './components/management/calendar-management/calendar-management.component';
import { ManagementCalendarBodyComponent } from './components/management/management-calendar-body/management-calendar-body.component';
import { ManagementBookingHoursComponent } from './components/management/management-booking-hours/management-booking-hours.component';
import { AppointmentComponent } from './components/home/appointment/appointment.component';

@NgModule({
  declarations: [
    AppComponent,
    AddEventDialogComponent,
    CalendarComponent,
    ChunkPipe,
    TestCalendarComponent,
    CalendarHeaderComponent,
    CalendarBodyComponent,
    BookingHoursComponent,
    HeaderComponent,
    CalendarManagementComponent,
    ManagementCalendarBodyComponent,
    ManagementBookingHoursComponent,
    AppointmentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
