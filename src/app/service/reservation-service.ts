import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import firebase from 'firebase';
import * as uuid from 'uuid';
import { ChangeReservationArg } from '../scheduler/changereservationarg';
import { SearchReservationArg } from '../scheduler/searchreservationargs';
import { ReservationDto } from '../model/reservationdto';
import { RoomDto } from '../model/roomdto';
import { BookingDto } from '../model/bookingdto';
import { PersonDto } from '../model/persondto';
import { RoomData } from '../data/room';
import { ChambreService } from './chambre.service';
import { Paiement } from '../model/paiementdto';
import { PaiementService } from './paiement.service';
import { AuthentificationService } from './authentification.service';

@Injectable()
export class ReservationService {

  bookings: BookingDto[];

  constructor(
    private http: HttpClient,
    private chambreService: ChambreService,
    private paiementService: PaiementService,
    private authService: AuthentificationService,
  ) { }

  getRooms(): Observable<object> {
    let rooms: RoomDto[];
    rooms = this.getAllRoom();
    return of(rooms);
  }

  getAllFromFirebase(): Promise<Array<BookingDto>> {
    return new Promise((resolve, reject) => {
      if (this.authService.hotelGlobal && this.authService.hotelGlobal.id) {
        const idhotel = this.authService.hotelGlobal.id;
        const reservations = new Array<BookingDto>();
        const db = firebase.firestore();
        db.collection('reservations').where('idhotel', '==', idhotel).get().then((resultats) => {
          console.log('La liste des reservations a été récupérée');
          resultats.forEach((resultat) => {
            const chambre = resultat.data() as BookingDto;
            reservations.push(chambre);
          });
          console.log('reservations');
          console.log(reservations);
          resolve(reservations);
        });
      }
    });
  }


  getReservations(args: ChangeReservationArg): Observable<object> {
    const res = new ReservationDto();

    this.getAllFromFirebase();
    const list1 = this.getAllRoom();
    /* if (args.roomtype !== 0) {
      list1 = list1.filter(l => l.roomType === args.roomtype);
    } */
    res.rooms = list1;

    const list2 = this.getAllBooking();
    /* if (args.roomtype !== 0) {
      list2 = list2.filter(l => l.roomType === args.roomtype);
    } */
    res.bookings = list2;

    return of(res);
  }

  getReservationByName(args: SearchReservationArg): Observable<object> {
    const persons = new Array<PersonDto>();

    if (args.year === 0 && args.month === 0 && args.name === '') {
      return of(persons);
    }

    let list = this.getAllBooking();
    if (args.year !== 0) {
      list = list.filter(l => l.startDate.getFullYear() === args.year);
    }
    if (args.month !== 0) {
      list = list.filter(l => l.startDate.getMonth() === args.month - 1);
    }
    if (args.name !== '') {
      list = list.filter(l => l.name.startsWith(args.name) === true);
    }

    for (const b of list) {
      const p = new PersonDto();
      p.bookingId = b.bookingId;
      p.roomId = b.roomId;
      p.roomType = b.roomType;
      p.roomNumber = this.getRoomById(p.roomId).roomNumber;
      p.roomTypeName = this.getRoomById(p.roomId).roomTypeName;
      p.startDate = b.startDate;
      p.endDate = b.endDate;
      p.stayDay = b.stayDay;
      p.name = b.name;
      p.tel = b.tel;
      p.email = b.email;
      p.cout = b.cout;
      p.reduction = b.reduction;
      persons.push(p);
    }

    return of(persons);
  }

  insertReservation(booking: BookingDto): Observable<string> {
    const list = this.getAllBooking();

    for (const item of list) {
      if (booking.bookingId !== item.bookingId && booking.roomId === item.roomId) {
        if (booking.startDate >= item.startDate && booking.startDate < item.endDate) {
          return throwError('wrong startDate: ' + booking.startDate.toString());
        }
        if (booking.endDate > item.startDate && booking.startDate < item.endDate) {
          return throwError('wrong endDate: ' + booking.endDate.toString());
        }
      }
    }
    booking.bookingId = uuid.v4();
    if (booking.payee) {
      const paiement = new Paiement(booking, booking.cout);
      this.paiementService.save(paiement);
    }
    list.push(booking);
    this.bookings = list;
    localStorage.setItem('ishango-hotels-reservations', JSON.stringify(this.bookings));
    this.saveToFirebase(booking);
    return of('ok');
  }

  updateReservation(booking: BookingDto): Observable<string> {
    const list = this.getAllBooking();

    for (const item of list) {
      if (booking.bookingId !== item.bookingId && booking.roomId === item.roomId) {
        if (booking.startDate >= item.startDate && booking.startDate < item.endDate) {
          return throwError('wrong startDate: ' + this.formatGMY(booking.startDate));
        }
        if (booking.endDate > item.startDate && booking.startDate < item.endDate) {
          return throwError('wrong endDate: ' + this.formatGMY(booking.endDate));
        }
      }
    }
    const index = list.findIndex(x => x.bookingId === booking.bookingId);
    list[index] = booking;
    this.bookings = list;
    localStorage.setItem('ishango-hotels-reservations', JSON.stringify(this.bookings));
    this.saveToFirebase(booking);

    return of('ok');
  }

  saveToFirebase(booking: BookingDto) {
    console.log('saveToFirebase');
    const db = firebase.firestore();
    let reservation: BookingDto;
    if (this.authService.hotelGlobal && this.authService.hotelGlobal.id) {
      console.log(this.authService.hotelGlobal.id);
      booking.idhotel = this.authService.hotelGlobal.id;
    }
    if (this.authService.utilisateurGlobal && this.authService.utilisateurGlobal.id) {
      console.log(this.authService.utilisateurGlobal.id);
      booking.idutilisateur = this.authService.utilisateurGlobal.id;
    }
    reservation = JSON.parse(JSON.stringify(booking));
    db.collection('reservations').doc('' + booking.bookingId).set(reservation).then(() => {
      console.log('La réservation a bien été enregistrée');
    });
  }

  deleteInFirebase(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('reservations').doc(id).delete().then(() => {
        console.log('La réservation a bien été supprimée');
        resolve(true);
      });
    });
  }


  deleteReservation(id: string): Observable<string> {
    const list = this.getAllBooking();

    const index = list.findIndex(x => x.bookingId === id);
    list.splice(index, 1);
    this.bookings = list;
    localStorage.setItem('ishango-hotels-reservations', JSON.stringify(this.bookings));

    return of('ok');
  }

  private formatGMY(date: Date): string {
    return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
  }

  private maxValue(list: BookingDto[]): number {
    if (list && list.length > 0) {
      return list.reduce((max, p) => 8 > max ? 0 : max, list.length);
    } else {
      return 0;
    }
  }

  private cloneBooking(list: BookingDto[]): BookingDto[] {
    const a = new Array<BookingDto>();
    for (const b of list) {
      a.push(b);
    }
    return a;
  }

  private getRoomById(value: number): RoomDto {
    const list = this.getAllRoom();
    const r = list.filter(l => l.roomId === value)[0];
    return r;
  }

  private getAllRoom(): RoomDto[] {
    console.log('getAllRoom');
    const chambres = this.chambreService.chambres;
    console.log(chambres);
    return this.chambreService.chambres;
  }

  public getBooking(id: string): BookingDto {
    let booking: BookingDto;
    const liste = this.getAllBooking();
    liste.forEach((b) => {
      if (b.bookingId === id) {
        booking = b;
      }
    });
    return booking;
  }

  public getAllBooking(): BookingDto[] {
    const liste = [];
    const bookingbdstring = localStorage.getItem('ishango-hotels-reservations');
    if (bookingbdstring) {
      console.log('Calendar bookings');
      const bookings = JSON.parse(bookingbdstring) as Array<BookingDto>;
      console.log(this.bookings);
      bookings.forEach((booking) => {
        const b = booking;
        b.startDate = new Date(b.startDate);
        b.endDate = new Date(b.endDate);
        liste.push(b);
      });
    }
    return liste;
  }
}
