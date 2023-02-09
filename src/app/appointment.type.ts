export type Appointment = {
    id?: string;
    start?: Date;
    end?: Date;
    title?: string | null;
    allDay?: boolean;
  }