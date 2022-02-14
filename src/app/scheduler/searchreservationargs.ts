export class SearchReservationArg {

  noms = '';
  prenoms = '';
  piece = 'CNI';
  numeroPiece = '00000000';
  tel = '';

  constructor(public year: number, public month: number, public name: string) { }

}
