import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-calendar-body',
  templateUrl: './calendar-body.component.html',
  styleUrls: ['./calendar-body.component.scss']
})
export class CalendarBodyComponent {

  @Input() calendarMatrix: any[] | undefined;
  @Input() selectedDate: Date | null | undefined;
  @Input() user: any;

  @Output() changeSelectedDate = new EventEmitter<Date>();
  @Output() showBookingHoursEvent = new EventEmitter<boolean>();

  public days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  isSelectedDate(date1: Date): boolean {
    return date1.getFullYear() === this.selectedDate?.getFullYear()
      && date1.getMonth() === this.selectedDate?.getMonth()
      && date1.getDate() === this.selectedDate?.getDate();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear()
      && date.getMonth() === today.getMonth()
      && date.getDate() === today.getDate();
  }

  onChangeSelectedDate(date: Date): void {
    this.changeSelectedDate.emit(date);
  }

  onShowBookingHours(): void {
    this.showBookingHoursEvent.emit(true);
  }
}
