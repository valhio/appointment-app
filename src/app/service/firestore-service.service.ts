import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private db: AngularFirestore) { }

  getVehicleCategories() {
    return this.db.collection('system').doc('vehicle').get().pipe(
      map((doc: any) => doc.data()['categories'])
    );
  }

  updateVehicleCategories(categories: string[]) {
    this.db.collection('system').doc('vehicle').set({ categories: categories }, { merge: true });
  }

  getServices() {
    return this.db.collection('system').doc('vehicle').get().pipe(
      map((doc: any) => doc.data()['services'])
    );
  }

  updateServices(services: string[]) {
    this.db.collection('system').doc('vehicle').set({ services: services }, { merge: true });
  }

  getNotifications(): Observable<string[]> {
    return this.db.collection('system').doc('alerts').get().pipe(
      map((doc: any) => doc.data()['notificationMessages'])
    );
  }

  updateNotifications(notifications: string[]) {
    this.db.collection('system').doc('alerts').set({ notificationMessages: notifications }, { merge: true });
  }

}