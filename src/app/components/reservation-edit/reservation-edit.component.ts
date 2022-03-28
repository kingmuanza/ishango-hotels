import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingDto } from 'src/app/model/bookingdto';
import { Paiement } from 'src/app/model/paiementdto';
import { RepasReservation } from 'src/app/model/repas.reservation.model';
import { PaiementService } from 'src/app/service/paiement.service';
import { RepasReservationService } from 'src/app/service/repas-reservation.service';
import { RepasService } from 'src/app/service/repas.service';
import { ReservationService } from 'src/app/service/reservation-service';

@Component({
  selector: 'app-reservation-edit',
  templateUrl: './reservation-edit.component.html',
  styleUrls: ['./reservation-edit.component.css']
})
export class ReservationEditComponent implements OnInit {

  booking: BookingDto;
  paiements = [];
  repasReservations = [];
  repas = [];
  total = 0;
  montantPercu = 0;

  additif: any;
  quantite = 1;
  nombreJours = 1;

  mode = 'OM';
  montant = 0;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private paiementService: PaiementService,
    private repasService: RepasService,
    private repasReservationService: RepasReservationService,
  ) { }

  ngOnInit() {
    this.repasService.getAllFromFirebase().then((repas) => {
      this.repas = repas;
      console.log('this.repas');
      console.log(this.repas);
    });
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.booking = this.reservationService.getBooking(id);
        console.log(this.booking);
        this.getPaiements();
        console.log('this.paiements');
        console.log(this.paiements);
        this.getRepasReservation();
        this.duree();
      }
    });
  }

  getPaiements() {
    this.montantPercu = 0;
    this.paiements = this.paiementService.getAllOfTReservation(this.booking);
    this.paiements.forEach((paiement) => {
      this.montantPercu += Number(paiement.montant);
    });
  }

  ajouterPaiement() {
    const montant = this.montant;
    const mode = this.mode;
    console.log(montant);
    console.log(mode);
    if (montant && mode) {
      const paiement = new Paiement(this.booking, montant);
      paiement.mode = mode;
      console.log(paiement);
      this.paiementService.save(paiement).then(() => {
        this.montant = 0;
        this.mode = '';
        this.getPaiements();
      });
    } else {
      alert('Veuillez entrer un montant et un mode de paiement');
    }
  }

  getRepasReservation() {
    console.log('this.booking.bookingId');
    console.log(this.booking.bookingId);
    this.total = 0;
    this.repasReservationService.getAllFromFirebase(this.booking.bookingId).then((repasReservations) => {
      console.log('repasReservations');
      console.log(repasReservations);
      this.repasReservations = repasReservations;
      this.repasReservations.forEach((repasReservation) => {
        this.total += repasReservation.repas.cout * repasReservation.quantite;
      });
      this.total += this.booking.cout;
    });
  }

  ajouterRepas() {
    console.log(this.additif);
    console.log(this.quantite);
    if (this.additif && this.quantite) {
      const repas = this.additif;
      const quantite = this.quantite;
      const repasReservation = new RepasReservation();
      repasReservation.idreservation = this.booking.bookingId;
      repasReservation.repas = repas;
      repasReservation.quantite = Number(quantite);
      console.log(repasReservation);
      this.repasReservationService.saveToFirebase(repasReservation).then(() => {
        this.getRepasReservation();
        this.additif = '';
        this.quantite = 1;
      });
    } else {
      alert('Veuillez sélectionner un repas et définir la quantité');
    }
  }

  duree() {
    if (this.booking.startDate && this.booking.endDate) {
      const t1 = new Date(this.booking.startDate).getTime();
      const t2 = new Date(this.booking.endDate).getTime();

      const jour = (t2 - t1) / (1000 * 60 * 60 * 24);
      console.log('Nombre de jours');
      console.log(jour);
      this.nombreJours = jour;
    }
  }

  facture() {
    this.router.navigate(['facture', 'voir', this.booking.bookingId]);
  }

}
