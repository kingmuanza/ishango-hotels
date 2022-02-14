import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingDto } from 'src/app/model/bookingdto';
import { Paiement } from 'src/app/model/paiementdto';
import { PaiementService } from 'src/app/service/paiement.service';
import { ReservationService } from 'src/app/service/reservation-service';

@Component({
  selector: 'app-reservation-edit',
  templateUrl: './reservation-edit.component.html',
  styleUrls: ['./reservation-edit.component.css']
})
export class ReservationEditComponent implements OnInit {

  booking: BookingDto;
  paiements = [];

  mode = 'OM';
  montant = 0;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private paiementService: PaiementService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.booking = this.reservationService.getBooking(id);
        console.log(this.booking);
        this.getPaiements();
        console.log('this.paiements');
        console.log(this.paiements);
      }
    });
  }

  getPaiements() {
    this.paiements = this.paiementService.getAllOfTReservation(this.booking);
    this.getPaiements();
  }

  ajouterPaiement(form: NgForm) {
    const montant = form.value.montant;
    const mode = form.value.mode;
    console.log(montant);
    console.log(mode);
    const paiement = new Paiement(this.booking, montant);
    console.log(paiement);
    this.paiementService.save(paiement).then(() => {
      this.montant = 0;
      form.value.montant = 0;
    });
  }

}
