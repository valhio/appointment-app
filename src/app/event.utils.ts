import { EventInput } from '@fullcalendar/core';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
    {
        id: createEventId(),
        title: 'Pesho Pacov',
        start: TODAY_STR + 'T00:00:00',
        end: TODAY_STR + 'T03:25:00'
    },
    {
        id: createEventId(),
        title: 'Timed event',
        start: TODAY_STR + 'T12:00:00',
        end: TODAY_STR + 'T15:00:00'
    },
    {
        id: createEventId(),
        title: 'All-day event',
        start: TODAY_STR + 'T24:30:00',
        allDay: true,
        // editable: false,
    },
];

export function createEventId() {
    return String(eventGuid++);
}

// EventInput is a type that describes the properties of an event
// More info at: https://fullcalendar.io/docs/event-object
/*
EventInput: {
    id?: string;
    groupId?: string;
    title?: string;
    url?: string;
    rendering?: string;
    startEditable?: boolean;
    durationEditable?: boolean;
    constraint?: string | any;
    overlap?: boolean | any;
    allow?: string | any;
    className?: string | string[];
    classNames?: string[];
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    editable?: boolean;
    start?: string | Date;
    end?: string | Date;
    date?: string | Date;
    allDay?: boolean;
    extendedProps?: any;
}
*/