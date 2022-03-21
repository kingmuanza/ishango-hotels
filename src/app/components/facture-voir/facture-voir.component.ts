import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingDto } from 'src/app/model/bookingdto';
import { Hotel } from 'src/app/model/hotel';
import { Paiement } from 'src/app/model/paiementdto';
import { RepasReservation } from 'src/app/model/repas.reservation.model';
import { AuthentificationService } from 'src/app/service/authentification.service';
import { PaiementService } from 'src/app/service/paiement.service';
import { RepasReservationService } from 'src/app/service/repas-reservation.service';
import { RepasService } from 'src/app/service/repas.service';
import { ReservationService } from 'src/app/service/reservation-service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-facture-voir',
  templateUrl: './facture-voir.component.html',
  styleUrls: ['./facture-voir.component.css']
})
export class FactureVoirComponent implements OnInit {

  @ViewChild('pdfTable') pdfTable: ElementRef;

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
  hotel: Hotel;
  constructor(
    private router: Router,
    private authService: AuthentificationService,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private paiementService: PaiementService,
    private repasService: RepasService,
    private repasReservationService: RepasReservationService,
  ) { }

  ngOnInit() {
    this.hotel = this.authService.hotelGlobal;
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

  ajouterPaiement(form: NgForm) {
    const montant = form.value.montant;
    const mode = form.value.mode;
    console.log(montant);
    console.log(mode);
    const paiement = new Paiement(this.booking, montant);
    paiement.mode = mode;
    console.log(paiement);
    this.paiementService.save(paiement).then(() => {
      this.montant = 0;
      form.value.montant = 0;
      this.getPaiements();
    });
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

  ajouterRepas(form: NgForm) {
    const repas = form.value.additif;
    const quantite = form.value.quantite;
    const repasReservation = new RepasReservation();
    repasReservation.idreservation = this.booking.bookingId;
    repasReservation.repas = repas;
    repasReservation.quantite = Number(quantite);
    console.log('form.value');
    console.log(form.value);
    console.log(repasReservation);

    this.repasReservationService.saveToFirebase(repasReservation).then(() => {
      this.getRepasReservation();
    });
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

  imprimer() {

  }

  exportAsPDF() {
    console.log('exportAsPDF');
    const data = document.getElementById('pdfTable');
    console.log('data');
    console.log(data);
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/jpeg');  // 'image/jpeg' for lower quality output.
      const pdf = new jsPDF('p', 'cm', 'a4'); // Generates PDF in landscape mode
      // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
      pdf.addImage(contentDataURL, 'JPEG', 0, 0, 21.0, 29.7);
      pdf.save('facture' + this.booking.bookingId + '.pdf');
    });
  }

}
