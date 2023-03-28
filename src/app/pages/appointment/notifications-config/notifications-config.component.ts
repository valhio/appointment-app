import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, BehaviorSubject } from 'rxjs';
import { FirestoreService } from 'src/app/service/firestore-service.service';
import { AddCategoryModalComponent } from '../booking-form-config/add-category-modal/add-category-modal.component';

@Component({
  selector: 'app-notifications-config',
  templateUrl: './notifications-config.component.html',
  styleUrls: ['./notifications-config.component.scss']
})
export class NotificationsConfigComponent {

  originalNotifications: string[] = [];
  subscriptions: Subscription[] = [];

  notificationsSubject = new BehaviorSubject<string[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private firestoreService: FirestoreService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.firestoreService.getNotifications().subscribe(notifications => {
        this.notificationsSubject.next(notifications);
        this.originalNotifications = new Array(...notifications);
      })
    )
  }

  arraymove(arr: string[], fromIndex: number, toIndex: number) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

  updateNotifications(notifications: string[]) {
    this.firestoreService.updateNotifications(notifications);
    this.ngOnInit();
  }

  deleteNotification(collection: string[], index: number) {
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

  cancel(collectionSubject: BehaviorSubject<string[]>, originalCollection: string[]) {
    collectionSubject.next(new Array(...originalCollection));
  }
}
