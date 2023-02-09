import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { createEventId, INITIAL_EVENTS } from '../event.utils';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';

@Component({
  selector: 'app-test-calendar',
  templateUrl: './test-calendar.component.html',
  styleUrls: ['./test-calendar.component.scss']
})
export class TestCalendarComponent {
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev today next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    buttonText: { today: 'Днес', month: 'Месец', week: 'Седмица', day: 'Ден', list: 'Лист' },
    slotMinTime: '08:00',
    // slotMaxTime: '18:00:00', 
    // slotDuration: '00:15:00', // 15 minute increments
    // slotLabelInterval: '00:15:00', // 15 minute increments
    slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: false },
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    locale:
    {
      code: 'bg',
    },
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];
  selectedWeek: Date[] = [];
  date: Date = new Date(Date.now());
  showBookingHours: boolean = false;
  selectedDate: Date | null = null;

  constructor(private changeDetector: ChangeDetectorRef, private dialog: MatDialog) {
    this.selectedWeek = this.getWeekOf(this.date);
  }

  getCurrentDay() {
    return new Date();
  }

  getWeekOf(date: Date) {
    let current = new Date(date);
    var week = new Array();
    // Starting Monday not Sunday
    current.setDate((current.getDate() - current.getDay() + 1));
    for (var i = 0; i < 7; i++) {
      week.push(
        new Date(current)
      );
      current.setDate(current.getDate() + 1);
    }
    return week;
  }

  onNavigatePreviousWeek() {
    this.date.setDate(this.date.getDate() - 7);
    this.selectedWeek = this.getWeekOf(this.date);
  }

  onNavigateNextWeek() {
    this.date.setDate(this.date.getDate() + 7);
    this.selectedWeek = this.getWeekOf(this.date);
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');

    // const dialogRef = this.dialog.open(AddEventDialogComponent, {
    //   data: {
    //     event: {
    //       start: selectInfo.start.toISOString().slice(0, 16),
    //       end: selectInfo.end.toISOString().slice(0, 16),
    //       allDay: selectInfo.allDay
    //     }
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Start result: ${ result.event.start }`);
    //   console.log(`End result: ${ result.event.end }`);
    // });

    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${ clickInfo.event.title }'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  openAddEventDialog() {
    this.dialog.open(AddEventDialogComponent,);
  }

  getDaysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  getDaysOfWeek() {
    // return ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота', 'Неделя'];
  }


  testBooking = {
    id: 1,
    bookingDate: new Date(),
    bookingTime: '10:00',
    bookingDuration: 60,
    bookingStatus: 'Зает',
    bookingType: 'Първичен',
    client: {
      id: 1,
      firstName: 'Иван',
      lastName: 'Иванов',
      phone: '0888888888',
      email: 'ivan@email',
      address: 'гр. София, ул. Цариградско шосе 100',
      notes: 'Някакви бележки'
    }
  }

  availableHours = [
    { id: 1, time: '09:00', duration: 60, status: 'Available', isBooked: false },
    { id: 2, time: '09:30', duration: 60, status: 'Available', isBooked: false },
    { id: 3, time: '10:00', duration: 60, status: 'Available', isBooked: false },
    { id: 4, time: '10:30', duration: 60, status: 'Available', isBooked: false },
    { id: 5, time: '11:00', duration: 60, status: 'Available', isBooked: false },
    { id: 6, time: '11:30', duration: 60, status: 'Available', isBooked: false },
    { id: 7, time: '12:00', duration: 60, status: 'Available', isBooked: false },
    { id: 8, time: '12:30', duration: 60, status: 'Available', isBooked: false },
    { id: 9, time: '13:00', duration: 60, status: 'Unavailable', isBooked: true },
    { id: 10, time: '13:30', duration: 60, status: 'Available', isBooked: false },
    { id: 11, time: '14:00', duration: 60, status: 'Available', isBooked: false },
    { id: 12, time: '14:30', duration: 60, status: 'Available', isBooked: false },
    { id: 13, time: '15:00', duration: 60, status: 'Available', isBooked: false },
    { id: 14, time: '15:30', duration: 60, status: 'Available', isBooked: false },
    { id: 15, time: '16:00', duration: 60, status: 'Available', isBooked: false },
  ]
}
