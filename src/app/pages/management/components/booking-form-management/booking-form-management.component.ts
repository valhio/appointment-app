import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/service/firestore-service.service';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from './add-dialog/add-dialog.component';

@Component({
  selector: 'app-booking-form-management',
  templateUrl: './booking-form-management.component.html',
  styleUrls: ['./booking-form-management.component.scss']
})
export class BookingFormManagementComponent implements OnInit {

  originalCategories: string[] = [];

  categoriesSubject = new BehaviorSubject<string[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private firestoreService: FirestoreService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.firestoreService.getVehicleCategories().subscribe(categories => {
      this.categoriesSubject.next(categories);
      this.originalCategories = new Array(...categories);
    });
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

  deleteCategory(index: number) {
    const categories = this.categoriesSubject.value;
    categories.splice(index, 1);
  }

  openAddDialog() {
    this.dialog.open(AddDialogComponent, {
      data: { value: '' },
      width: '90%',
      maxWidth: '500px'
    }).afterClosed().subscribe((value: string) => {
      if (value) {
        console.log('value', value);
        
        const categories = this.categoriesSubject.value;
        categories.push(value);

        // this.updateCategories(categories);
      }
    })
  }

  openEditDialog(index: number) {
    const categories = this.categoriesSubject.value;
    this.dialog.open(AddDialogComponent, {
      data: { value: categories[index] },
      width: '90%',
      maxWidth: '500px'
    }).afterClosed().subscribe((value: string) => {
      if (value) {
        categories[index] = value;
      }
    })
  }


  compareArray(a: string[], b: string[]) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  cancel() {
    this.categoriesSubject.next(new Array(...this.originalCategories));
  }
}
