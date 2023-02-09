import { JsonPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentData, DocumentSnapshot, QuerySnapshot } from '@angular/fire/compat/firestore';
import { catchError, map, Observable, of } from 'rxjs';
import { Booking } from '../model/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private db: AngularFirestore) { }

  getBookingsForMonth(date: Date): Observable<QuerySnapshot<DocumentData>> {
    return this.db
      .collection('bookings')
      .doc(date.getFullYear().toString())
      .collection(date.getMonth().toString())
      .get()
  }

  getBookingsForDate(date: Date): Observable<QuerySnapshot<DocumentData>> {
    return this.getDayRef(date)
      .collection('data')
      .get()
    // return this.db.collection<any>(`bookings/${ date.getFullYear().toString() }/${ date.getMonth().toString() }/${ date.getDate().toString() }`).valueChanges()
  }

  getDayRef(date: Date): AngularFirestoreDocument<DocumentData> {
    return this.db.
      collection('bookings')
      .doc(date.getFullYear().toString())
      .collection(date.getMonth().toString())
      .doc(date.getDate().toString());
  }

  getDay(date: Date): Observable<any> {
    return this.getDayRef(date).get();
  }

  getBookingByBookingTime(date: Date, bookingTime: string): Observable<any> {
    return this.getDayRef(date).collection('data').doc(bookingTime).get()
  }

  addBooking(booking: Booking) {
    return this.getDayRef(booking.bookingDate).collection('data').doc(booking.bookingTime).set(booking)
      .catch(error => {
        console.error("Error adding booking: ", error);
      })
  }

  deleteBookingByBookingTime(date: Date, bookingTime: string) {
    return this.getDayRef(date).collection('data').ref.where('bookingTime', '==', bookingTime).get()
      .then(snapshot => {
        snapshot.docs[0].ref.delete();
      })
      .catch(error => {
        console.error(error);
      })
  }

  deleteBookingById(date: Date, id: string) {
    return this.getDayRef(date).collection('data').doc(id).delete()
      .catch(error => {
        console.error("Error removing booking: ", error);
      })
  }

  deleteDay(date: Date) {
    this.getDayRef(date).delete();
  }

  isDateAllBooked(date: Date): Observable<boolean> {
    let allBooked = false;
    return this.getDay(date).pipe(
      map(snapshot => {
        if (snapshot.exists) {
          allBooked = snapshot.get("numberOfBookedBookings") === this.getBookingHours().length;
        }
        return allBooked;
      }),
      catchError(error => {
        console.error(error);
        return of(false);
      })
    )
  }

  getNumberOfBookedBookings(date: Date): Observable<number> {
    let numberOfBookedBookings = 0;
    return this.getDay(date).pipe(
      map(snapshot => {
        if (snapshot.exists) {
          numberOfBookedBookings = snapshot.get("numberOfBookedBookings");
        }
        return numberOfBookedBookings;
      }),
      catchError(error => {
        console.error(error);
        return of(0);
      })
    )
  }

  updateNumberOfBookedBookings(date: Date, numberOfBookedBookings: number) {
    if (numberOfBookedBookings <= 0) this.deleteDay(date);
    else this.getDayRef(date).set({ numberOfBookedBookings }, { merge: true });
  }

  getBookingHours() {
    return ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];

    // const bookingHoursCollection = this.db.collection('bookingHours', ref => ref.orderBy('time'));
    //   this.subscriptions.push(
    //     bookingHoursCollection.valueChanges().subscribe((res: any) => {
    //       this.bookingHours = [];
    //       res.forEach((element: any) => {
    //         this.bookingHours.push(element.time);
    //       });
    //     })
    //   );
  }

}
