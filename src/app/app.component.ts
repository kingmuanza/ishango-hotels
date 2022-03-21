import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Utility } from './appcore/utility';
import firebase from 'firebase';
import { Utilisateur } from './model/utilisateur';
import * as bcrypt from 'bcryptjs';
import { AuthentificationService } from './service/authentification.service';
import { Hotel } from './model/hotel';
import { ChambreService } from './service/chambre.service';
import { ReservationService } from './service/reservation-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AppCalendar';
  utilisateur;

  errorMessage = '';

  login = 'dona';
  passe = 'dona2022';
  hotel: Hotel;
  interval;
  showFiller = false;

  // storage: FirebaseStorage;

  constructor(
    private authService: AuthentificationService,
    private chambreService: ChambreService,
    private reservationService: ReservationService,
  ) {
    const firebaseConfig = {
      apiKey: 'AIzaSyCvVQksw26HLWT_33_7cZ9EQ8f-EMeZSFc',
      authDomain: 'ishango-hotels.firebaseapp.com',
      projectId: 'ishango-hotels',
      storageBucket: 'ishango-hotels.appspot.com',
      messagingSenderId: '838335878832',
      appId: '1:838335878832:web:0a12fb137b2cbea92b4d75',
      measurementId: 'G-S18HW1MF1P'
    };
    firebase.initializeApp(firebaseConfig);
  }

  ngOnInit(): void {
    this.autoConnexion();
  }

  async connexion2(form: NgForm) {
    // const db = getFirestore();
    if (form.invalid) {
      return;
    }
    const login = Utility.toString(form.value.login);
    const passe = Utility.toString(form.value.passe);

    console.log('credentials');
    console.log(login);
    console.log(passe);
    const u = new Utilisateur();

    const salt = bcrypt.genSaltSync(10);


    u.login = 'dona';
    u.passe = bcrypt.hashSync('dona2022', 10);
    u.nom = 'Dona Biyong';
    u.actif = true;
    u.dateCreation = new Date();
    u.profil = 'ADMIN';

    this.utilisateur = JSON.parse(JSON.stringify(u));
    const db = firebase.firestore();

    db.collection('utilisateurs').doc('1').set(this.utilisateur).then(() => {
      console.log('PREMIER UTILISATEUR CREE !!!');
    });
  }

  sousConnexion(login: string, passe: string) {
    this.authService.connexion(login, passe).then((utilisateur) => {
      console.log('CONNEXION AVEC SUCCES !!!');
      console.log(utilisateur);
      this.authService.getHotel(utilisateur.idhotel).then((hotel) => {
        this.synchronisateur(hotel.id).then(() => {
          this.utilisateur = utilisateur;
          this.hotel = hotel;
        });

        localStorage.setItem('ishango-utilisateur', JSON.stringify(utilisateur));
        localStorage.setItem('ishango-hotel', JSON.stringify(hotel));

        setInterval(() => {
          console.log('je synchronise');
          this.synchronisateur(hotel.id).then(() => {
            console.log('fin de la synchronisation');
          });
        }, 60 * 1000);
      }).catch((e) => {
        console.log(e);
      });
    }).catch((e) => {
      console.log('erreur !!!');
      console.log(e);
      this.errorMessage = e;
    });
  }

  autoConnexion() {
    const utilisateurString = localStorage.getItem('ishango-utilisateur');
    const hotelString = localStorage.getItem('ishango-hotel');
    if (utilisateurString && hotelString) {
      this.utilisateur = JSON.parse(utilisateurString);
      this.hotel = JSON.parse(hotelString);
      this.authService.utilisateurGlobal = JSON.parse(utilisateurString);
      this.authService.hotelGlobal = JSON.parse(hotelString);
    } else {

    }
  }

  deconnexion() {
    const oui = confirm('Etes-vous sûr de vouloir vous déconnecter');
    if (oui) {
      localStorage.removeItem('ishango-utilisateur');
      localStorage.removeItem('ishango-hotel');
      this.utilisateur = null;
      this.hotel = null;
    }
  }

  async connexion(form: NgForm) {
    this.errorMessage = '';
    if (form.invalid) {
      return;
    }
    const login = Utility.toString(form.value.login);
    const passe = Utility.toString(form.value.passe);
    this.sousConnexion(login, passe);
  }

  synchronisateur(idhotel: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.chambreService.getAllFromFirebase().then((chambres) => {
        localStorage.setItem('hotel-chambres', JSON.stringify(chambres));
        this.reservationService.getAllFromFirebase().then((reservations) => {
          localStorage.setItem('ishango-hotels-reservations', JSON.stringify(reservations));
          resolve('');
        });
      });
    });
  }

}
