import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { RoomDto } from 'src/app/model/roomdto';
import { DateAndWeek } from '../datemanager';
import { BookingDto } from 'src/app/model/bookingdto';
import { StatusbarArg } from '../changestatusbarargs';
import { ReservationArg } from '../reservationargs';
import { bindCallback } from 'rxjs';
import { ReservationService } from 'src/app/service/reservation-service';
import { ChambreService } from 'src/app/service/chambre.service';
import { AuthentificationService } from 'src/app/service/authentification.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './calendar-reservation.component.html',
  styleUrls: ['./calendar-reservation.component.css']
})
export class CalendarReservationComponent implements OnInit, OnChanges {
  @Input() room: RoomDto;
  @Input() day: DateAndWeek;
  @Input() bookings: BookingDto[];
  @Output() changestatusbar = new EventEmitter<StatusbarArg>();
  @Output() reservation = new EventEmitter<ReservationArg>();
  isreserved = false;
  isreservedSx = false;
  isreservedCx = false;
  isreservedDx = false;
  booking: BookingDto;
  precedent: BookingDto;
  payeeDernierJour: boolean;
  payee: boolean;
  nombre = 0;

  constructor(
    private reservationService: ReservationService,
    private chambreService: ChambreService,
    private authService: AuthentificationService,
  ) { }

  ngOnInit() { }

  synchronisateur(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.chambreService.getAllFromFirebase().then((chambres) => {
        localStorage.setItem('hotel-chambres', JSON.stringify(chambres));
        this.reservationService.getAllFromFirebase().then((reservations) => {
          localStorage.setItem('ishango-hotels-reservations', JSON.stringify(reservations));
          resolve('');
        });
      });
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.bookings) {
      console.log('Calendar reservation change');
      // console.log(changes.bookings);
      this.datasourceChanged();
    }
  }

  onMouseEnter(b: BookingDto) {
    const args = new StatusbarArg('enter', b);
    this.changestatusbar.emit(args);
  }

  onMouseLeave(b: BookingDto) {
    const args = new StatusbarArg('leave', b);
    this.changestatusbar.emit(args);
  }

  onDayReservation(mouse: MouseEvent) {
    this.synchronisateur();
    const b = new BookingDto();
    if (this.booking) {
      b.bookingId = this.booking.bookingId;
      b.roomId = this.booking.roomId;
      b.roomType = this.booking.roomType;
      b.startDate = new Date(this.booking.startDate);
      b.endDate = new Date(this.booking.endDate);
      b.stayDay = this.booking.stayDay;
      b.noms = this.booking.noms;
      b.prenoms = this.booking.prenoms;
      b.email = this.booking.email;
      b.tel = this.booking.tel;
      b.reduction = this.booking.reduction;
      b.name = this.booking.name;
      b.payee = this.booking.payee;
    }
    const args = new ReservationArg(this.room.roomId, this.day.date, b);
    this.reservation.emit(args);
  }

  private datasourceChanged() {
    this.isreserved = false;
    this.isreservedDx = false;
    this.isreservedCx = false;
    this.isreservedSx = false;
    this.booking = undefined;
    const list = this.bookings.filter((b) => {
      return b.roomId === this.room.roomId;
    });
    /* console.log('la liste des réservation de : ');
    console.log(this.room.roomId);
    console.log('La date du jour : ');
    console.log(this.day.date);
    console.log(list); */
    this.precedent = undefined;
    for (const b of list) {
      this.nombre += 1;
      /* console.log('Réservation : ');
      console.log(b.bookingId);
      console.log(b.startDate);
      console.log(b.endDate); */
      if (this.day.date >= b.startDate && this.day.date <= b.endDate) {
        // console.log('Réservation confirmée');
        this.isreserved = true;
        const d = this.day.date.getTime();

        if (d === b.startDate.getTime() && d !== b.endDate.getTime()) {
          this.booking = b;
          this.isreservedDx = true;
        }

        if (d !== b.startDate.getTime() && d !== b.endDate.getTime()) {
          this.booking = b;
          this.isreservedCx = true;
        }

        if (d !== b.startDate.getTime() && d === b.endDate.getTime()) {
          this.isreservedSx = true;
          if (b.payee) {
            this.payee = true;
          }
        }
      }
      this.precedent = b;
    }
  }

}
