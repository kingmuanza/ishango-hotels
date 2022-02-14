
export class PersonDto {
  bookingId: string;
  roomId: number;
  roomNumber: string;
  roomType: number;
  roomTypeName: string;
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
  cout = 0;
  payee = false;
  reduction: number;

  constructor() {
    this.bookingId = '0';
    this.roomId = 0;
    this.roomNumber = '';
    this.roomType = 0;
    this.roomTypeName = '';
    this.startDate = undefined;
    this.endDate = undefined;
    this.stayDay = 0;
    this.name = '';
  }

}
