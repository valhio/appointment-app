import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-new-calendar-body',
  templateUrl: './new-calendar-body.component.html',
  styleUrls: ['./new-calendar-body.component.scss']
})
export class NewCalendarBodyComponent {

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
