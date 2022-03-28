import { Injectable } from '@angular/core';

import firebase from 'firebase';
import * as bcrypt from 'bcryptjs';
import { Utilisateur } from '../model/utilisateur';
import { Hotel } from '../model/hotel';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  utilisateurGlobal: Utilisateur;
  hotelGlobal: Hotel;
  utilisateurSubject = new Subject<Utilisateur>();
  hotelSubject = new Subject<Hotel>();
  constructor() { }

  connexion(login: string, passe: string): Promise<Utilisateur> {
    console.log('connexion');
    return new Promise((resolve, reject) => {
      let utilisateur: Utilisateur;
      let utilisateurTrouvee = false;
      const db = firebase.firestore();
      db.collection('utilisateurs').where('login', '==', login).get().then((resultats) => {
        resultats.forEach((resultat) => {
          const u = resultat.data() as Utilisateur;
          utilisateur = u;
          utilisateurTrouvee = true;
        });
        if (utilisateur) {
          bcrypt.compare(passe, utilisateur.passe).then((result) => {
            if (result) {
              this.utilisateurSubject.next(utilisateur);
              this.utilisateurGlobal = utilisateur;
              resolve(utilisateur);
            } else {
              reject('Mot de passe incorrect');
            }
          });
        } else {
          reject('Aucun utilisateur trouvé');
        }

      });
    });
  }

  getHotel(idhotel: string): Promise<Hotel> {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('hotels').doc(idhotel).get().then((resultat) => {
        if (resultat.exists) {
          const hotel = resultat.data() as Hotel;
          this.hotelSubject.next(hotel);
          this.hotelGlobal = hotel;
          resolve(hotel);
        } else {
          reject('Aucun hotel n`\'est associé à ce compte');
        }
      });
    });
  }

  synchronisateur() {

  }


}
