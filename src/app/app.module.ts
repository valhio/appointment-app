import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddEventDialogComponent } from './pages/management/components/calendar-settings/add-event-dialog/add-event-dialog.component';
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
import { AppointmentComponent } from './pages/appointment/appointment.component';
import { BookingFormComponent } from './pages/appointment/components/booking-form/booking-form.component';
import { BookingStatusComponent } from './pages/booking-status/booking-status.component';
import { LoginComponent } from './pages/login/login.component';
import { AddDialogComponent } from './pages/management/components/booking-form-settings/add-dialog/add-dialog.component';
import { CalendarSettingsComponent } from './pages/management/components/calendar-settings/calendar-settings.component';
import { BookingFormSettingsComponent } from './pages/management/components/booking-form-settings/booking-form-settings.component';
import { NotificationsSettingsComponent } from './pages/management/components/notifications-settings/notifications-settings.component';
import { ManagementCalendarBodyComponent } from './pages/management/components/calendar-settings/management-calendar-body/management-calendar-body.component';
import { ManagementBookingHoursComponent } from './pages/management/components/calendar-settings/management-booking-hours/management-booking-hours.component';
import { SystemSettingsComponent } from './pages/management/components/system-settings/system-settings.component';
import { UpdateSystemSettingsComponent } from './pages/management/components/system-settings/update-system-settings/update-system-settings.component';
import { NewAppointmentComponent } from './new/new-appointment/new-appointment.component';
import { CalendarComponent } from './new/new-appointment/calendar/calendar.component';
import { NewCalendarHeaderComponent } from './new/new-appointment/calendar/new-calendar-header/new-calendar-header.component';
import { NewCalendarBodyComponent } from './new/new-appointment/calendar/new-calendar-body/new-calendar-body.component';
import { NewCalendarFooterComponent } from './new/new-appointment/calendar/new-calendar-footer/new-calendar-footer.component';
import { CalendarDataComponent } from './new/new-appointment/calendar/new-calendar-footer/calendar-data/calendar-data.component';
import { NewCalendarSettingsComponent } from './new/new-appointment/calendar/new-calendar-footer/new-calendar-settings/new-calendar-settings.component';
import { BookingFormConfigComponent } from './new/new-appointment/booking-form-config/booking-form-config.component';
import { AddCategoryModalComponent } from './new/new-appointment/booking-form-config/add-category-modal/add-category-modal.component';
import { NotificationsConfigComponent } from './new/new-appointment/notifications-config/notifications-config.component';
import { SystemConfigComponent } from './new/new-appointment/system-config/system-config.component';
import { UpdateFieldModalComponent } from './new/new-appointment/system-config/update-field-modal/update-field-modal.component';

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
    AddDialogComponent,
    CalendarSettingsComponent,
    BookingFormSettingsComponent,
    NotificationsSettingsComponent,
    SystemSettingsComponent,
    UpdateSystemSettingsComponent,
    NewAppointmentComponent,
    CalendarComponent,
    NewCalendarHeaderComponent,
    NewCalendarBodyComponent,
    NewCalendarFooterComponent,
    CalendarDataComponent,
    NewCalendarSettingsComponent,
    BookingFormConfigComponent,
    AddCategoryModalComponent,
    NotificationsConfigComponent,
    SystemConfigComponent,
    UpdateFieldModalComponent,
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
