
export class BookingDto {
  bookingId: string;
  roomId: number;
  roomType: number;
  startDate: Date;
  endDate: Date;
  stayDay: number;
  name: string;

  noms = '';
  prenoms = '';
  piece = 'CNI';
  numeroPiece = '00000000';
  tel = '';
  email = '';

  petitDejeuner = false;
  dejeuner = false;

  reduction = 0;
  cout = 0;

  payee = false;
  roomNumber: string;
  roomTypeName: string;
  montantPercu = 0;
  total = 0;
  idhotel: string;
  idutilisateur: string;

  constructor() {
    this.bookingId = '0';
    this.roomId = 0;
    this.roomType = 0;
    this.startDate = undefined;
    this.endDate = undefined;
    this.stayDay = 0;
    this.name = '';
  }

}
