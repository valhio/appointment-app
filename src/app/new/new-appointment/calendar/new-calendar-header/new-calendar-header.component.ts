import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-new-calendar-header',
  templateUrl: './new-calendar-header.component.html',
  styleUrls: ['./new-calendar-header.component.scss']
})
export class NewCalendarHeaderComponent {

  @Input() currentDate: Date | null | undefined;

  @Output() navigatePrevious = new EventEmitter<void>();
  @Output() navigateNext = new EventEmitter<void>();
  @Output() navigateToday = new EventEmitter<void>();

  monthNames = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];


  onNavigatePreviousMonth(): void {
    this.navigatePrevious.emit();
  }

  onNavigateNextMonth(): void {
    this.navigateNext.emit();
  }
}
