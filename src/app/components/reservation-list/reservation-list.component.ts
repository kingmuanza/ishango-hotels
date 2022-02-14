import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { PersonDto } from 'src/app/model/persondto';
import { SearchReservationArg } from 'src/app/scheduler/searchreservationargs';
import { SelectReservationArg } from 'src/app/scheduler/selectreservationarg';
import { ReservationService } from 'src/app/service/reservation-service';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit, AfterViewInit {

  @Output() selectreservation = new EventEmitter<SelectReservationArg>();
  @ViewChild('fastsearch') fastsearch: ElementRef;
  persons$: Observable<object>;
  years = '0';
  months = '0';
  name = '';
  bookings = [];

  montantPercus = 0;
  total = 0;

  constructor(
    private reservationService: ReservationService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.actualiser();
  }

  actualiser() {
    this.reservationService.getAllFromFirebase().then((bookings) => {
    this.bookings = bookings;
    this.montantPercus = 0;
    this.bookings.forEach((booking) => {
      this.montantPercus += booking.montantPercu;
      this.total += booking.cout;
    });
    console.log('this.bookings');
    console.log(this.bookings);
  });

  }

  ngAfterViewInit() {
    fromEvent(this.fastsearch.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.name = this.fastsearch.nativeElement.value;
        const search = new SearchReservationArg(+this.years, +this.months, this.name);
        this.persons$ = this.reservationService.getReservationByName(search);
      })
    ).subscribe();
    setTimeout(() => {
      const s = new SearchReservationArg(0, 0, '');
      this.persons$ = this.reservationService.getReservationByName(s);
    }, 1000);
  }

  onYearsChange(data) {
    console.log('data');
    console.log(data);
    console.log(this.months);
    console.log(this.name);
    this.years = data.value;
    const search = new SearchReservationArg(+this.years, +this.months, this.name);
    this.persons$ = this.reservationService.getReservationByName(search);
  }

  onMonthsChange(data) {
    console.log('data');
    console.log(data);
    this.months = data.value;
    const search = new SearchReservationArg(+this.years, +this.months, this.name);
    this.persons$ = this.reservationService.getReservationByName(search);
  }

  onSelect(person: PersonDto) {
    const roomId = person.roomId;
    const startDate = person.startDate;
    const endDate = person.endDate;
    const args = new SelectReservationArg(roomId, startDate, endDate);
    this.selectreservation.emit(args);
    this.router.navigate(['reservations', 'edit', person.bookingId]);
  }

}
