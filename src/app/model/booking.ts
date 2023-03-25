export class Booking {
    firstName!: string;
    lastName!: string;
    phone: string = '';
    registrationNumber: string = '';
    vehicleCategory: string = '';
    bookingType: string = '';
    bookingDate: Date = new Date();
    bookingTime: string = '';
    createdAt: Date | null = new Date();
 
}