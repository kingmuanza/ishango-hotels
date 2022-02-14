import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

import { BookingDto } from 'src/app/model/bookingdto';
import { Utility } from 'src/app/appcore/utility';
import { ReservationService } from 'src/app/service/reservation-service';
import { ChambreService } from 'src/app/service/chambre.service';
import { Chambre } from 'src/app/model/chambredto';
import { PaiementService } from 'src/app/service/paiement.service';
import { Paiement } from 'src/app/model/paiementdto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialogreservation',
  templateUrl: './form-reservation.component.html',
  styleUrls: ['./form-reservation.component.css']
})
export class FormReservationComponent implements OnInit, OnDestroy {
  title: string;
  $rooms: any;
  sub: Subscription;
  roomid: number;
  room: Chambre;
  startDate: Date;
  endDate: Date;
  booking: BookingDto;
  rooms: any;

  complement = 'Aucun';
  telephone = '';
  email = '';

  chambre: Chambre;
  nombreJours = 1;
  total = 0;
  reduction = 0;

  payee = false;

  // tslint:disable-next-line:max-line-length
  constructor(
    private service: ReservationService,
    private paiementService: PaiementService,
    private dialogRef: MatDialogRef<FormReservationComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private chambreService: ChambreService,
    private router: Router,
  ) {
    console.log('MAT_DIALOG_DATA');
    console.log(data);
    this.roomid = data.roomid;

    console.log('Room');
    console.log(this.roomid);
    this.chambreService.get(this.roomid).then((chambre) => {
      console.log('chambre');
      console.log(chambre);
      this.chambre = chambre;
      this.total = this.chambre.cout;
    });

    console.log('LES DONNES QUE NOUS AVONS RECUES');
    console.log(data.booking);

    if (data.booking.bookingId === '0') {
      this.title = 'Nouvelle ';
      this.startDate = data.date;
      this.endDate = new Date(new Date(data.date).getTime() + 1000 * 60 * 60 * 24);
    } else {
      this.title = 'Modifier ';
      this.startDate = data.booking.startDate;
      this.endDate = data.booking.endDate;
      this.telephone = data.booking.telephone;
      this.email = data.booking.email;
      this.payee = data.booking.payee;
    }
    this.booking = data.booking;
    this.$rooms = data.rooms;
  }

  ngOnInit() {
    this.sub = this.$rooms.subscribe(result => {
      // this.rooms = result;
    });

    this.chambreService.getAll().then((rooms) => {
      this.rooms = rooms;
      // this.rooms = r.rooms;
    });
  }

  voir() {
    this.router.navigate(['reservations', 'edit', this.booking.bookingId]);
    this.dialogRef.close('no');
  }

  onConfirm(form: NgForm) {
    if (form.invalid === true) {
      return;
    }
    const vm = new BookingDto();

    const complement = Utility.toString(form.value.complement);
    if (complement === 'Petit') {
      vm.petitDejeuner = true;
    }
    if (complement === 'Dej') {
      vm.dejeuner = true;
    }
    if (complement === 'Deux') {
      vm.dejeuner = true;
      vm.petitDejeuner = true;
    }
    vm.bookingId = '0';
    vm.roomId = Utility.toInteger(this.chambre.roomId);
    vm.roomNumber = Utility.toString(this.chambre.roomNumber);
    vm.roomTypeName = Utility.toString(this.chambre.roomTypeName);
    vm.reduction = Utility.toInteger(form.value.reduction);
    vm.total = this.chambre.cout * this.nombreJours;
    vm.cout = this.chambre.cout * this.nombreJours - this.reduction;
    vm.startDate = Utility.toDate(form.value.startDate);
    vm.endDate = Utility.toDate(form.value.endDate);
    vm.noms = Utility.toString(form.value.noms);
    vm.prenoms = Utility.toString(form.value.prenoms);
    vm.name = vm.noms + ' ' + vm.prenoms;
    vm.tel = Utility.toString(form.value.tel);
    vm.email = Utility.toString(form.value.email);
    vm.payee = form.value.payee;

    if (vm.payee) {
      vm.montantPercu = vm.cout;
    }

    console.log('la réservation');
    console.log(form.value.payee);
    console.log(vm);
    //
    if (vm.endDate < vm.startDate) {
      alert('La date de début doit venir avec la date de fin');
      return;
    }
    const index = this.rooms.findIndex(x => x.roomId === vm.roomId);
    vm.roomType = this.rooms[index].roomType;
    this.computeStayDay(vm.startDate, vm.endDate);
    //
    if (vm.bookingId === '0') {
      this.service.insertReservation(vm).subscribe(
        result => this.dialogRef.close(result),
        error => alert(error)
      );
    } else {
      this.service.updateReservation(vm).subscribe(
        result => this.dialogRef.close(result),
        error => alert(error)
      );
    }
  }

  onDelete() {
    const id = this.booking.bookingId;
    this.service.deleteInFirebase(id).then(() => {
      this.service.deleteReservation(id).subscribe(
        result => this.dialogRef.close(result),
        error => alert(error)
      );
    });
  }

  onClose() {
    this.dialogRef.close('no');
  }

  private computeStayDay(startDate: Date, endDate: Date): number {
    const valret = 0;
    //
    // ???
    //
    return valret;
  }

  onRoomChange(ev) {
    console.log('Nouvellle room');
    console.log(ev);
    this.chambreService.get(ev.value).then((chambre) => {
      console.log('chambre');
      console.log(chambre);
      this.chambre = chambre;
    });
  }

  onDateChange(form: NgForm) {
    const debut = Utility.toDate(form.value.startDate);
    const fin = Utility.toDate(form.value.endDate);

    if (debut && fin) {
      const t1 = new Date(debut).getTime();
      const t2 = new Date(fin).getTime();

      const jour = (t2 - t1) / (1000 * 60 * 60 * 24);
      console.log('Nombre de jours');
      console.log(jour);
      this.nombreJours = jour;
    }
  }

  reductionChange(ev) {
    console.log(ev);
    if (ev) {
      console.log(Number(ev));
      this.reduction = Number(ev);
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
