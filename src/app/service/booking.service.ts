import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentData, QuerySnapshot } from '@angular/fire/compat/firestore';
import { catchError, map, Observable, of } from 'rxjs';
import { Booking } from '../model/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private db: AngularFirestore) {
  }

  getBookingsForMonth(date: Date): Observable<QuerySnapshot<DocumentData>> {
    return this.db
      .collection('bookings')
      .doc(date.getFullYear().toString())
      .collection(date.getMonth().toString())
      .get()
  }

  getBookingsForDate(date: Date): Observable<Booking[]> {
    return this.getDayRef(date).collection('data').get().pipe(
      map(querySnapshot => querySnapshot.docs.map(doc => doc.data() as Booking)),
    )
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
    return this.getDayRef(date).collection('data').doc(id).ref.delete()
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
          // TODO: Make this work with custom booking hours ==========================================================================================================================
          allBooked = snapshot.get("numberOfBookedBookings") === this.getDefaultBookingHours().length;
        }
        return allBooked;
      }),
      catchError(error => {
        console.error(error);
        return of(false);
      })
    )
  }

  isWorkDay(date: Date): Observable<boolean | null> {
    let isWorkDay: any = null;
    return this.getDay(date).pipe(
      map(snapshot => {
        if (snapshot.exists) { // If the day exists in the database
          isWorkDay = snapshot.get("isWorkDay");
        }
        return isWorkDay;
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
    // if (numberOfBookedBookings <= 0) this.deleteDay(date);
    this.getDayRef(date).set({ numberOfBookedBookings }, { merge: true });
  }

  getDefaultBookingHours(): string[] {
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

  getBookingHours(date: Date): Observable<string[]> {
    return this.getDayRef(date).get().pipe(
      map(snapshot => {
        if (snapshot.exists) {
          return snapshot.get("bookingHours");
        }
        return this.getDefaultBookingHours();
      }),
      map(bookingHours => {
        return bookingHours.sort((a: string, b: string) => {
          const timeA: number = parseInt(a.split(":")[0]) * 60 + parseInt(a.split(":")[1]);
          const timeB: number = parseInt(b.split(":")[0]) * 60 + parseInt(b.split(":")[1]);
          return timeA - timeB;
        });
      })
      ,
      catchError(error => {
        console.error(error);
        return of(this.getDefaultBookingHours());
      })
    )

    // this.getDayRef(date).get().subscribe((doc: any) => {
    //   if (doc.exists) {
    //     console.log(doc.data().bookingHours);
    //     doc.data().bookingHours ? doc.data().bookingHours : [];

    //   }
    // })
  }

  setDayAsNotWorkDay(date: Date) {
    this.getDayRef(date).set({ isWorkDay: false }, { merge: true });
  }

  setDayAsWorkDay(date: Date) {
    this.getDayRef(date).set({ isWorkDay: true }, { merge: true });
  }

  setBookingHours(date: Date, bookingHours: string[]) {
    this.getDayRef(date).set({ bookingHours: bookingHours }, { merge: true });
  }

}
