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
import { ChunkPipe } from './chunk.pipe';
import { TestCalendarComponent } from './test-calendar/test-calendar.component';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from "../environments/environment";
import { HomeComponent } from './pages/home/home.component';
import { CalendarHeaderComponent } from './pages/appointment/components/calendar-header/calendar-header.component';
import { CalendarBodyComponent } from './pages/appointment/components/calendar-body/calendar-body.component';
import { BookingHoursComponent } from './pages/appointment/components/booking-hours/booking-hours.component';
import { HeaderComponent } from './components/header/header.component';
import { CalendarManagementComponent } from './pages/management/calendar-management.component';
import { ManagementCalendarBodyComponent } from './pages/management/components/management-calendar-body/management-calendar-body.component';
import { ManagementBookingHoursComponent } from './pages/management/components/management-booking-hours/management-booking-hours.component';
import { AppointmentComponent } from './pages/appointment/appointment.component';
import { BookingFormComponent } from './pages/appointment/components/booking-form/booking-form.component';
import { BookingStatusComponent } from './pages/booking-status/booking-status.component';
import { LoginComponent } from './pages/login/login.component';
import { BookingFormManagementComponent } from './pages/management/components/booking-form-management/booking-form-management.component';
import { AddDialogComponent } from './pages/management/components/booking-form-management/add-dialog/add-dialog.component';
import { CalendarSettingsComponent } from './pages/management/components/calendar-settings/calendar-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    AddEventDialogComponent,
    HomeComponent,
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
    BookingFormComponent,
    BookingStatusComponent,
    LoginComponent,
    BookingFormManagementComponent,
    AddDialogComponent,
    CalendarSettingsComponent,
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
