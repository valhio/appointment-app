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
import CalendarTwoComponent from './calendar-two/calendar-two.component';

@NgModule({
  declarations: [
    AppComponent,
    AddEventDialogComponent,
    CalendarComponent,
    ChunkPipe,
    TestCalendarComponent,
    CalendarTwoComponent,
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
