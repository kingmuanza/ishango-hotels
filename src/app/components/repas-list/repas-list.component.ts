import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chambre } from 'src/app/model/chambredto';
import { Repas } from 'src/app/model/repasdto';
import { RepasService } from 'src/app/service/repas.service';
import { ReservationService } from 'src/app/service/reservation-service';

@Component({
  selector: 'app-repas-list',
  templateUrl: './repas-list.component.html',
  styleUrls: ['./repas-list.component.css']
})
export class RepasListComponent implements OnInit {
  repas = [];

  constructor(
    private service: ReservationService,
    private repasService: RepasService,
    private router: Router
  ) { }

  ngOnInit() {
    this.repasService.getAllFromFirebase().then((repas) => {
      this.repas = repas;
    });
  }

  nouveau() {
    console.log('nouveau');
    this.router.navigate(['repas', 'edit']);
  }

  modifier(repas: Repas) {
    console.log('modifier');
    this.router.navigate(['repas', 'edit', repas.id]);
  }

}
