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
  selector: 'app-info-utilisateur',
  templateUrl: './info-utilisateur.component.html',
  styleUrls: ['./info-utilisateur.component.css']
})

export class InfoUtilisateurComponent implements OnInit {

  @ViewChild('logo') logo: ElementRef<HTMLElement>;
  utilisateur = new Utilisateur();
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
    if (this.authService.utilisateurGlobal) {
      this.utilisateur = this.authService.utilisateurGlobal;
      if (this.authService.utilisateurGlobal.id) {
        this.utilisateurService.get(this.authService.utilisateurGlobal.id).then((utilisateur) => {
          this.utilisateur = utilisateur;
        });
      }
    }
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

  modifierMotDePasse() {
    if (this.nouveau) {
      if (this.nouveau.length > 4) {
        if (this.nouveau === this.confirmation) {
          bcrypt.compare(this.ancien, this.utilisateur.passe).then((result) => {
            if (result) {
              const salt = bcrypt.genSaltSync(10);
              this.utilisateur.passe = bcrypt.hashSync(this.nouveau, 10);
              const u = JSON.parse(JSON.stringify(this.utilisateur));
              this.utilisateurService.save(this.utilisateur).then(() => {
                this.openSnackBar('Votre mot de passe a été mis à jour', 'Fermer');
                this.deconnexion();
                window.location.reload();
              });
            } else {

            }
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

  supprimer() {
    const oui = confirm('Etes-vous sûr de vouloir supprimer cette utilisateur');
    if (oui) {
      this.utilisateurService.delete(this.utilisateur).then(() => {
        this.router.navigate(['utilisateur']);
      });
    }
  }

  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      console.log('event.target.files[0].name');
      this.nom = event.target.files[0].name;
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (ev) => {
        let x: any;
        x = ev.target;
        this.url = x.result;
      };
    }
  }

  changerImage() {
    const el: HTMLElement = this.logo.nativeElement;
    el.click();
  }

  saveImageToFirebase(): Promise<string> {
    return new Promise((resolve, reject) => {
      const storage = firebase.storage();
      const storageRef = storage.ref();
      if (this.nom) {
        const reference = storageRef.child('images/' + this.utilisateur.id + '/' + this.nom);
        console.log(reference);
        reference.putString(this.url, 'data_url').then((snapshot) => {
          console.log('Uploaded a blob or file!');
          resolve(snapshot.ref.getDownloadURL());
        });
      }
    });
  }

}
