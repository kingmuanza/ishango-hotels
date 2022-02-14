import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chambre } from 'src/app/model/chambredto';
import { ChambreService } from 'src/app/service/chambre.service';
import { ReservationService } from 'src/app/service/reservation-service';

@Component({
  selector: 'app-chambre-list',
  templateUrl: './chambre-list.component.html',
  styleUrls: ['./chambre-list.component.css']
})
export class ChambreListComponent implements OnInit {
  chambres = [];

  constructor(
    private service: ReservationService,
    private chambreService: ChambreService,
    private router: Router
  ) { }

  ngOnInit() {
    /* this.chambreService.getAll().then((chambres) => {
      this.chambres = chambres;
    }); */
    this.chambreService.getAllFromFirebase().then((chambres) => {
      this.chambres = chambres;
    });
  }

  actualiser() {
    this.chambreService.getAllFromFirebase().then((chambres) => {
      this.chambres = chambres;
    });
  }
  nouveau() {
    console.log('nouveau');
    this.router.navigate(['chambres', 'edit']);
  }

  modifier(chambre: Chambre) {
    console.log('modifier');
    this.router.navigate(['chambres', 'edit', chambre.roomId]);
  }

}
