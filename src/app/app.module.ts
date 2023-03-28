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
import { AppointmentComponent } from './pages/appointment/appointment.component';
import { CalendarComponent } from './pages/appointment/calendar/calendar.component';
import { CalendarHeaderComponent } from './pages/appointment/calendar/calendar-header/calendar-header.component';
import { CalendarBodyComponent } from './pages/appointment/calendar/calendar-body/calendar-body.component';
import { CalendarFooterComponent } from './pages/appointment/calendar/calendar-footer/calendar-footer.component';
import { CalendarDataComponent } from './pages/appointment/calendar/calendar-footer/calendar-data/calendar-data.component';
import { CalendarSettingsComponent } from './pages/appointment/calendar/calendar-footer/calendar-settings/calendar-settings.component';
import { BookingFormConfigComponent } from './pages/appointment/booking-form-config/booking-form-config.component';
import { AddCategoryModalComponent } from './pages/appointment/booking-form-config/add-category-modal/add-category-modal.component';
import { NotificationsConfigComponent } from './pages/appointment/notifications-config/notifications-config.component';
import { SystemConfigComponent } from './pages/appointment/system-config/system-config.component';
import { UpdateFieldModalComponent } from './pages/appointment/system-config/update-field-modal/update-field-modal.component';
import { AddBookingModalComponent } from './pages/appointment/calendar/calendar-footer/add-booking-modal/add-booking-modal.component';
import { BookingFormComponent } from './pages/appointment/calendar/booking-form/booking-form.component';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChunkPipe,
    HeaderComponent,
    BookingStatusComponent,
    LoginComponent,
    AppointmentComponent,
    CalendarComponent,
    CalendarHeaderComponent,
    CalendarBodyComponent,
    CalendarFooterComponent,
    CalendarDataComponent,
    CalendarSettingsComponent,
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
    MatSelectModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
