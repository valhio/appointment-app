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

  getServices() {
    return this.db.collection('system').doc('vehicle').get().pipe(
      map((doc: any) => doc.data()['services'])
    );
  }

  updateVehicleCategories(categories: string[]) {
    this.db.collection('system').doc('vehicle').set({ categories: categories }, { merge: true });
  }

  updateServices(services: string[]) {
    this.db.collection('system').doc('vehicle').set({ services: services }, { merge: true });
  }

}
