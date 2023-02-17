import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss']
})
export class CalendarHeaderComponent {

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
