import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import firebase from 'firebase';
import { Utility } from 'src/app/appcore/utility';
import { Utilisateur } from 'src/app/model/utilisateur';
import { AuthentificationService } from 'src/app/service/authentification.service';
import { UtilisateurService } from 'src/app/service/utilisateur.service';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-utilisateur-edit',
  templateUrl: './utilisateur-edit.component.html',
  styleUrls: ['./utilisateur-edit.component.css']
})
export class UtilisateurEditComponent implements OnInit {

  @ViewChild('logo') logo: ElementRef<HTMLElement>;
  utilisateur = new Utilisateur();
  hotel: any;
  modification = false;
  id: string;
  url: any;
  nom: string;
  ancien: string;
  nouveau: string;
  confirmation: string;

  constructor(
    private utilisateurService: UtilisateurService,
    private authService: AuthentificationService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    console.log('this.utilisateur');
    console.log(this.utilisateur);
    console.log('this.hotel');
    console.log(this.hotel);
    this.hotel = this.authService.hotelGlobal;
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.utilisateurService.getFromFirebase(id).then((utilisateur) => {
          this.utilisateur = utilisateur;
          this.modification = true;
        });
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  enregistrer() {
    this.utilisateurService.save(this.utilisateur).then(() => {
      this.openSnackBar('Enregistré avec succès', 'Fermer');
      this.authService.utilisateurGlobal = this.utilisateur;
      window.location.reload();
    });
  }

  deconnexion() {
    const oui = confirm('Etes-vous sûr de vouloir vous déconnecter');
    if (oui) {
      localStorage.removeItem('ishango-utilisateur');
      localStorage.removeItem('ishango-hotel');
      this.utilisateur = null;
    }
  }

  ajouter() {
    if (this.utilisateur.login) {
      this.utilisateurService.getWithLogin(this.utilisateur.login).then((liste) => {
        if (liste.length > 0) {
          alert('le login a déjà été utilisé');
        } else {
          if (this.nouveau) {
            if (this.nouveau.length > 4) {
              if (this.nouveau === this.confirmation) {
                if (this.hotel && this.utilisateur.login && this.utilisateur.profil) {
                  const salt = bcrypt.genSaltSync(10);
                  this.utilisateur.passe = bcrypt.hashSync(this.nouveau, 10);
                  this.utilisateur.idhotel = this.hotel.id;
                  const u = JSON.parse(JSON.stringify(this.utilisateur));
                  console.log('utilisateur');
                  console.log(u);
                  this.utilisateurService.enregistrer(this.utilisateur).then(() => {
                    this.openSnackBar('Utilisateur créé', 'Fermer');
                    this.router.navigate(['utilisateurs']);
                  });
                }
              } else {
                alert('les mots de passe doivent être identiques');
              }
            } else {
              alert('Le mot de passe doit être supérieur à 4 caractères');
            }
          } else {
            alert('Veuillez entrer le nouveau mot de passe');
          }
        }
      });
    }
  }

  modifier() {
    if (this.hotel && this.utilisateur.login && this.utilisateur.profil) {
      this.utilisateur.idhotel = this.hotel.id;
      const u = JSON.parse(JSON.stringify(this.utilisateur));
      console.log('utilisateur');
      console.log(u);
      this.utilisateurService.enregistrer(this.utilisateur).then(() => {
        this.openSnackBar('Utilisateur mofidié', 'Fermer');
        this.router.navigate(['utilisateurs']);
      });
    }
  }

  supprimer() {
    const oui = confirm('Etes-vous sûr de vouloir supprimer cette utilisateur');
    if (oui) {
      this.utilisateurService.delete(this.utilisateur).then(() => {
        this.router.navigate(['utilisateur']);
      });
    }
  }

  reinitialiser() {
    if (this.nouveau) {
      if (this.nouveau.length > 4) {
        if (this.nouveau === this.confirmation) {
          const salt = bcrypt.genSaltSync(10);
          this.utilisateur.passe = bcrypt.hashSync(this.nouveau, 10);
          this.utilisateur.idhotel = this.hotel.id;
          const u = JSON.parse(JSON.stringify(this.utilisateur));
          console.log('utilisateur');
          console.log(u);
          this.utilisateurService.enregistrer(this.utilisateur).then(() => {
            this.openSnackBar('Le mot de passe a été mis à jour', 'Fermer');
            this.router.navigate(['utilisateurs']);
          });
        } else {
          alert('les mots de passe doivent être identiques');
        }
      } else {
        alert('Le mot de passe doit être supérieur à 4 caractères');
      }
    } else {
      alert('Veuillez entrer le nouveau mot de passe');
    }
  }

}
