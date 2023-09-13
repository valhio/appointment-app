import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, BehaviorSubject, tap, of } from 'rxjs';
import { FirestoreService } from 'src/app/service/firestore-service.service';
import { AddCategoryModalComponent } from './add-category-modal/add-category-modal.component';

@Component({
  selector: 'app-booking-form-config',
  templateUrl: './booking-form-config.component.html',
  styleUrls: ['./booking-form-config.component.scss']
})
export class BookingFormConfigComponent {

  activeTab = 'vehicle-categories'

  subscriptions: Subscription[] = [];

  originalCategories: string[] = [];
  originalServices: string[] = [];
  originalAdditionalServices: string[] = [];

  bookingFormData$ = of({});

  categories: string[] = [];
  categoryAlert!: string;
  services: string[] = [];
  additionalServices: string[] = [];

  categoryAlertEditMode = false;

  constructor(private firestoreService: FirestoreService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.bookingFormData$ = this.firestoreService.getSystemBookingFormData().pipe(
      tap((doc: any) => {
        this.categories = doc.data()['categories'];
        this.originalCategories = doc.data()['categories'];
        this.services = doc.data()['services'];
        this.originalServices = doc.data()['services'];
        this.additionalServices = doc.data()['additionalServices'];
        this.originalAdditionalServices = doc.data()['additionalServices'];
        this.categoryAlert = doc.data()['alerts']['categoryField'] as string || '';

      }),
    )
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

  onUpdateCategoryAlert(newAlert: string) {
    this.firestoreService.updatecategoryFieldAlert(newAlert.trim());
    this.ngOnInit();
  }

  updateServices(services: string[]) {
    this.firestoreService.updateServices(services);
    this.ngOnInit();
  }

  updateAdditionalServices(additionalServices: string[]) {
    this.firestoreService.updateAdditionalServices(additionalServices);
    this.ngOnInit();
  }

  deleteCategory(collection: string[], index: number) {
    collection.splice(index, 1);
  }

  openAddDialog(collection: string[]) {
    this.dialog.open(AddCategoryModalComponent, {
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
    this.dialog.open(AddCategoryModalComponent, {
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

  cancel(newCollection: string[], originalCollection: string[]) {
    originalCollection = newCollection;
  }
}
