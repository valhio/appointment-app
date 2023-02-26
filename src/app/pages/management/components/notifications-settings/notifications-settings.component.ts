import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirestoreService } from 'src/app/service/firestore-service.service';

@Component({
  selector: 'app-notifications-settings',
  templateUrl: './notifications-settings.component.html',
  styleUrls: ['./notifications-settings.component.scss']
})
export class NotificationsSettingsComponent implements OnInit {

  originalNotifications: string[] = [];

  notificationsSubject = new BehaviorSubject<string[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.firestoreService.getNotifications().subscribe(notifications => {
      this.notificationsSubject.next(notifications);
      this.originalNotifications = new Array(...notifications);
    });
  }



}
