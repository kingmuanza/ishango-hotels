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

  persons$: Observable<object>;
  years = '0';
  months = '0';
  noms = '';
  name = '';
  bookings = [];

  montantPercus = 0;
  total = 0;
  resultats = [];

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
      this.resultats = bookings;
      this.montantPercus = 0;
      this.total = 0;
      this.bookings.forEach((booking) => {
        this.montantPercus += booking.montantPercu;
        this.total += booking.cout;
      });
      console.log('this.bookings');
      console.log(this.bookings);
    });

    this.months = '0';
    this.years = '0';

  }

  ngAfterViewInit() {
  }

  rechercher() {
    this.resultats = this.bookings;
    this.onYearsChange();
    this.onMonthsChange();
    this.onNomChange();
  }

  onYearsChange() {
    this.resultats = [];
    if (Number(this.years) > 0) {
      this.bookings.forEach((booking) => {
        if (booking.startDate) {
          const date = new Date(booking.startDate);
          const annee = date.toISOString().split('T')[0].split('-')[0];
          if (annee === this.years) {
            this.resultats.push(booking);
          }
        }
      });
    } else {
      this.resultats = this.bookings;
    }
  }

  onMonthsChange() {
    const resultats = [];
    if (Number(this.months) > 0) {
      this.resultats.forEach((booking) => {
        if (booking.startDate) {
          const date = new Date(booking.startDate);
          const mois = date.toISOString().split('T')[0].split('-')[1];
          if (Number(mois) === Number(this.months)) {
            resultats.push(booking);
          }
        }
      });
      this.resultats = resultats;
    }
  }

  onSelect(person: PersonDto) {
    this.router.navigate(['reservations', 'edit', person.bookingId]);
  }

  onNomChange() {
    const resultats = [];
    const mot = this.noms;
    console.log('onNomChange');
    console.log(mot);
    console.log(this.resultats.length);
    console.log('les autres traitements sont finis');
    if (mot) {
      this.resultats.forEach((booking) => {
        console.log(booking.name);
        if (booking.name) {
          let nom: string;
          nom = booking.name;
          if (nom.indexOf(mot) !== -1) {
            resultats.push(booking);
          }
        }
      });
      this.resultats = resultats;
    } else {
    }
  }
}
