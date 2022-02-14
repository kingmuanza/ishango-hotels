import { Injectable } from '@angular/core';
import { Repas } from '../model/repasdto';

import firebase from 'firebase';
import { AuthentificationService } from './authentification.service';
@Injectable({
  providedIn: 'root'
})
export class RepasService {

  constructor(
    private authService: AuthentificationService,
  ) { }

  get(id: string): Promise<Repas> {
    let repas: Repas;
    return new Promise((resolve, reject) => {
      this.getAll().then((liste) => {
        liste.forEach((c) => {
          if (c.id === id) {
            repas = c;
          }
        });
        resolve(repas);
      });
    });
  }

  getAll(): Promise<Array<Repas>> {
    return new Promise((resolve, reject) => {
      const listString = localStorage.getItem('hotel-repas');
      if (listString) {
        resolve(JSON.parse(listString));
      } else {
        resolve([]);
      }
    });
  }

  getAllFromFirebase(): Promise<Array<Repas>> {
    return new Promise((resolve, reject) => {
      if (this.authService.hotelGlobal && this.authService.hotelGlobal.id) {
        const idhotel = this.authService.hotelGlobal.id;
        const repass = new Array<Repas>();
        const db = firebase.firestore();
        db.collection('repas').where('idhotel', '==', idhotel).get().then((resultats) => {
          console.log('La liste des repas a été récupérée');
          resultats.forEach((resultat) => {
            const repas = resultat.data() as Repas;
            repass.push(repas);
          });
          console.log('repass');
          console.log(repass);
          resolve(repass);
        });
      }
    });
  }

  save(repas: Repas) {
    const nouvelleListe = [];
    let nouveau = true;
    return new Promise((resolve, reject) => {
      this.getAll().then((all) => {
        all.forEach((c) => {
          if (c.id === repas.id) {
            nouvelleListe.push(repas);
            nouveau = false;
          } else {
            nouvelleListe.push(c);
          }
        });
        if (nouveau) {
          nouvelleListe.push(repas);
        }
        this.saveToFirebase(repas).then(() => {
          localStorage.setItem('hotel-repas', JSON.stringify(nouvelleListe));
          resolve(nouvelleListe);
        });
      });
    });
  }

  saveToFirebase(repas: Repas) {
    return new Promise((resolve, reject) => {
      console.log('saveToFirebase');
      let c: Repas;
      if (this.authService.hotelGlobal && this.authService.hotelGlobal.id) {
        console.log(this.authService.hotelGlobal.id);
        const idhotel = this.authService.hotelGlobal.id;
        repas.idhotel = idhotel;
        const db = firebase.firestore();
        c = JSON.parse(JSON.stringify(repas));
        db.collection('repas').doc(c.id).set(c).then(() => {
          console.log('La repas a bien été enregistré');
          resolve(c);
        });
      }
    });
  }

  delete(repas: Repas) {
    const nouvelleListe = [];
    return new Promise((resolve, reject) => {
      this.getAll().then((repass) => {
        repass.forEach((c) => {
          if (c.id === repas.id) {
          } else {
            nouvelleListe.push(c);
          }
        });
        localStorage.setItem('hotel-repas', JSON.stringify(nouvelleListe));
        resolve(nouvelleListe);
      });
    });
  }
}
