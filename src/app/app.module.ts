import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { ChunkPipe } from './chunk.pipe';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from "../environments/environment";
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { BookingStatusComponent } from './pages/booking-status/booking-status.component';
import { LoginComponent } from './pages/login/login.component';
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
import { AddBookingModalComponent } from './new/new-appointment/calendar/new-calendar-footer/add-booking-modal/add-booking-modal.component';
import { BookingFormComponent } from './new/new-appointment/calendar/booking-form/booking-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChunkPipe,
    HeaderComponent,
    BookingStatusComponent,
    LoginComponent,
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
    AddBookingModalComponent,
    BookingFormComponent,
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
