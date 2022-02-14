export class Paiement {
    id: string;
    montant = 0;
    date: Date;
    booking: any;
    bookingID: string;
    idhotel: string;

    constructor(booking: any, montant: number) {
        this.id = new Date().getTime() + '';
        this.date = new Date();
        this.booking = booking;
        this.montant = montant;
        this.bookingID = booking.bookingId;
    }
}
