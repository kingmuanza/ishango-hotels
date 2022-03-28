import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utilisateur } from 'src/app/model/utilisateur';
import { AuthentificationService } from 'src/app/service/authentification.service';
import { UtilisateurService } from 'src/app/service/utilisateur.service';

@Component({
  selector: 'app-utilisateur-list',
  templateUrl: './utilisateur-list.component.html',
  styleUrls: ['./utilisateur-list.component.css']
})
export class UtilisateurListComponent implements OnInit {

  resultats = [];
  utilisateur;

  constructor(
    private authService: AuthentificationService,
    private utilisateurService: UtilisateurService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.utilisateur = this.authService.utilisateurGlobal;
    this.utilisateurService.getAllFromHotel(this.utilisateur.idhotel).then((resultats) => {
      this.resultats = resultats;
    });
  }

  onSelect(utilisateur: Utilisateur) {
    this.router.navigate(['utilisateurs', 'edit', utilisateur.id]);
  }

  ajouter() {
    this.router.navigate(['utilisateurs', 'edit']);
  }

}
