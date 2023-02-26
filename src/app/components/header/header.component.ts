import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../service/firestore-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showAdditionalService = false;

  notifications$ = this.firestoreService.getNotifications();

  constructor(public router: Router, private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.showAdditionalService = true;
    }, 2000);
  }

  getNotifications(){
    this.firestoreService.getNotifications();
  }

  closeAdditionalServiceNotification(): void {
    this.showAdditionalService = false;
  }

  openGoogleMaps() {
    window.open('https://maps.app.goo.gl/bu8iN1tRXcVpa6eu5', '_blank');
  }
}
