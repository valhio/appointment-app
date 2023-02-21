import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  openGoogleMaps() {
    window.open('https://maps.app.goo.gl/bu8iN1tRXcVpa6eu5', '_blank');
  }
}
