import { Component, OnInit } from '@angular/core';
import 'firebase/database';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  showAdditionalService = true;

  ngOnInit(): void {
    // setTimeout(() => {
    // this.showAdditionalService = false;
    // }, 10000);
  }

  closeAdditionalServiceNotification(): void {
    this.showAdditionalService = !this.showAdditionalService;
  }

}
