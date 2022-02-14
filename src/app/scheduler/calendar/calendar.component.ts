import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { CalendarNavbarComponent } from '../calendar-navbar/calendar-navbar.component';
import { DateManager, DateAndWeek, StepHours } from '../datemanager';
import { ChangeReservationArg } from '../changereservationarg';
import { ChangeDateArg } from '../changedatearg';
import { RoomDto } from 'src/app/model/roomdto';
import { BookingDto } from 'src/app/model/bookingdto';
import { HeaderDays } from '../model/headerdays';
import { StatusbarArg } from '../changestatusbarargs';
import { ReservationArg } from '../reservationargs';
import { ReservationService } from 'src/app/service/reservation-service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() year: number;
  @Input() month: number;
  @Input() day: number;
  @Input() rooms: RoomDto[];
  @Input() bookings: BookingDto[];
  @Output() changereservation = new EventEmitter<ChangeReservationArg>();
  @Output() reservation = new EventEmitter<ReservationArg>();
  @ViewChild(CalendarNavbarComponent) navbar;
  stepdays: DateAndWeek[] = [];
  stephours: StepHours[] = [];
  headerdays: HeaderDays;
  statusbar: BookingDto;
  manager: DateManager;

  constructor(
    private reservationService: ReservationService
  ) {
    this.manager = new DateManager();
    this.rooms = [];
    this.bookings = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Calendar on change');
    this.bookings = this.reservationService.getAllBooking();
  }

  get currentYMD(): Date {
    console.log('il y a til une navbar');
    console.log(this.navbar);
    if (this.navbar) {
      return this.navbar.currymd;
    } else {
      return undefined;
    }
  }

  ngOnInit() {
    // console.log(this.currentYMD);
  }

  onDaysChanged(data: ChangeDateArg) {
    this.headerdays = data.days;
    const startDate = data.days.startDate;
    const endDate = data.days.endDate;
    const roomtype = data.roomtype;
    const args = new ChangeReservationArg(data.type, data.operation, roomtype, startDate, endDate);
    this.changereservation.emit(args);
  }

  onStatusbarChanged(args: StatusbarArg) {
    if (args.type === 'enter') {
      this.statusbar = args.booking;
    } else {
      this.statusbar = undefined;
    }
  }

  onDayReservation(args: ReservationArg) {
    this.reservation.emit(args);
  }

}
