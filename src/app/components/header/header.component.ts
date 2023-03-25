import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of, BehaviorSubject, Subscription, Observable } from 'rxjs';
import { FirestoreService } from '../../service/firestore-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showAdditionalService = false;
  notifications$: Observable<string[]> = of([]);
  systemSettings$: Observable<{ maps: string[], workHours: string[], phone: string }> = this.firestoreService.getSystemSettings();

  constructor(public router: Router, private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.router.url === '/' || this.router.url === '/home') {
        this.notifications$ = this.firestoreService.getNotifications();
        this.showAdditionalService = true;
      }
    }, 2000);
  }

  getNotifications() {
    this.firestoreService.getNotifications();
  }

  closeNotification(collection: string[], index: number): void {
    collection.splice(index, 1);
  }

  openGoogleMaps(path: string) {
    window.open(path, '_blank');
  }
}
