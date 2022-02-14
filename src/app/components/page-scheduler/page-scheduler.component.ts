import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Subscription } from 'rxjs';

import { FormReservationComponent } from '../form-reservation/form-reservation.component';
import { ReservationDto } from '../../model/reservationdto';
import { RoomDto } from '../../model/roomdto';
import { BookingDto } from '../../model/bookingdto';
import { ChangeReservationArg } from '../../scheduler/changereservationarg';
import { ReservationArg } from 'src/app/scheduler/reservationargs';
import { ReservationService } from '../../service/reservation-service';
import { ChambreService } from 'src/app/service/chambre.service';

@Component({
  selector: 'app-pagescheduler',
  templateUrl: './page-scheduler.component.html',
  styleUrls: ['./page-scheduler.component.css']
})
export class PageSchedulerComponent implements OnInit {
  year: number;
  month: number;
  day: number;
  currentsearch: ChangeReservationArg;
  sub: Subscription;
  rooms: RoomDto[];
  bookings: BookingDto[];

  constructor(
    private dialog: MatDialog,
    private service: ReservationService,
    private cd: ChangeDetectorRef,
    private chambreService: ChambreService
  ) {
    // const d = new Date();
    const d = new Date();
    this.year = d.getFullYear();
    this.month = d.getMonth() + 1;
    this.day = d.getDate();
    this.rooms = [];
    this.bookings = [];
    console.log('Im getting all bookings');
    const bookingbdstring = localStorage.getItem('ishango-hotels-reservations');
    if (bookingbdstring) {
      this.bookings = JSON.parse(bookingbdstring);
    }
    console.log(this.bookings);
  }

  ngOnInit() {
    this.onReservationChanged(null);
  }

  onReservationChanged(args: ChangeReservationArg) {
    console.log('onReservationChanged 123456');
    this.currentsearch = args;
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = undefined;
    }
    this.sub = this.service.getReservations(args).subscribe(result => {
      const r = result as ReservationDto;
      console.log('result as ReservationDto 123456');
      console.log(r);
      this.rooms = r.rooms;
      this.bookings = r.bookings;
      this.cd.detectChanges();
      this.chambreService.getAllFromFirebase().then((rooms) => {
      });
    });
  }

  onDayReservation(args: ReservationArg) {
    console.log('onDayReservation 123456');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = '550px';
    const list = this.service.getRooms();
    this.chambreService.getAll().then((rooms) => {
      this.rooms = rooms;
    });
    dialogConfig.data = { roomid: args.roomid, date: args.date, booking: args.booking, rooms: list };
    const dialogRef = this.dialog.open(FormReservationComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'ok') {
        this.onReservationChanged(this.currentsearch);
      }
      if (data === 'no') {
      }
    });
  }

}
