import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-calendar-body',
  templateUrl: './calendar-body.component.html',
  styleUrls: ['./calendar-body.component.scss']
})
export class CalendarBodyComponent {

  @Input() calendarMatrix: any[] | undefined;
  @Input() currentDate: Date | null | undefined;

  @Output() changeSelectedDate = new EventEmitter<Date>();

  public days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  showBookingHours: boolean = true;

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  }

  isToday(date: Date): boolean {
    return this.isSameDate(date, new Date());
  }

  onChangeSelectedDate(date: Date): void {
    this.changeSelectedDate.emit(date);
  }
}
