import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/service/firestore-service.service';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from './add-dialog/add-dialog.component';

@Component({
  selector: 'app-booking-form-settings',
  templateUrl: './booking-form-settings.component.html',
  styleUrls: ['./booking-form-settings.component.scss']
})
export class BookingFormSettingsComponent {

  activeTab = 'vehicle-categories'

  originalCategories: string[] = [];
  originalServices: string[] = [];

  categoriesSubject = new BehaviorSubject<string[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  servicesSubject = new BehaviorSubject<string[]>([]);
  services$ = this.servicesSubject.asObservable();

  constructor(private firestoreService: FirestoreService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.firestoreService.getVehicleCategories().subscribe(categories => {
      this.categoriesSubject.next(categories);
      this.originalCategories = new Array(...categories);
    });
  }

  getServices() {
    this.firestoreService.getServices().subscribe(services => {
      this.servicesSubject.next(services);
      this.originalServices = new Array(...services);
    }
    );
  }

  arraymove(arr: string[], fromIndex: number, toIndex: number) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

  updateCategories(categories: string[]) {
    this.firestoreService.updateVehicleCategories(categories);
    this.ngOnInit();
  }

  updateServices(services: string[]) {
    this.firestoreService.updateServices(services);
    this.getServices();
  }

  deleteCategory(collection: string[], index: number) {
    collection.splice(index, 1);
  }

  openAddDialog(collection: string[]) {
    this.dialog.open(AddDialogComponent, {
      data: { value: '' },
      width: '90%',
      maxWidth: '500px'
    }).afterClosed().subscribe((value: string) => {
      if (value) {
        collection.push(value);
      }
    })
  }

  openEditDialog(collection: string[], index: number) {
    this.dialog.open(AddDialogComponent, {
      data: { value: collection[index] },
      width: '90%',
      maxWidth: '500px'
    }).afterClosed().subscribe((value: string) => {
      if (value) {
        collection[index] = value;
      }
    })
  }


  compareArray(a: string[], b: string[]) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  cancel(collectionSubject: BehaviorSubject<string[]>, originalCollection: string[]) {
    collectionSubject.next(new Array(...originalCollection));
  }
}
