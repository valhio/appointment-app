import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showAdditionalService = false;

  constructor(public router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.showAdditionalService = true;
    }, 2000);
  }

  closeAdditionalServiceNotification(): void {
    this.showAdditionalService = false;
  }

  openGoogleMaps() {
    window.open('https://maps.app.goo.gl/bu8iN1tRXcVpa6eu5', '_blank');
  }
}
