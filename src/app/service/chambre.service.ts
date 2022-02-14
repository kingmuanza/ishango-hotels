import { Injectable } from '@angular/core';
import { Chambre } from '../model/chambredto';
import firebase from 'firebase';
import { AuthentificationService } from './authentification.service';

@Injectable({
  providedIn: 'root'
})
export class ChambreService {

  chambres = [];

  constructor(
    private authService: AuthentificationService,
  ) {
    this.getAll().then((all) => {
      this.chambres = all;
      console.log(this.chambres);
    });

    const listString = localStorage.getItem('hotel-chambres');
    if (!listString) {
      const c1 = new Chambre();
      c1.roomId = 101;
      c1.roomNumber = 'Chambre 101';
      c1.roomType = 0;
      c1.roomTypeName = '0';
      c1.cout = 10000;
      const c2 = new Chambre();
      c2.roomId = 102;
      c2.roomNumber = 'Chambre 102';
      c2.roomType = 0;
      c2.roomTypeName = '1';
      c2.cout = 17000;
      const chambres = [];
      chambres.push(c1);
      chambres.push(c2);
      localStorage.setItem('hotel-chambres', JSON.stringify(chambres));
    }
  }

  get(id: number): Promise<Chambre> {
    let chambre: Chambre;
    return new Promise((resolve, reject) => {
      this.getAll().then((chambres) => {
        chambres.forEach((c) => {
          if (c.roomId === id) {
            chambre = c;
          }
        });
        resolve(chambre);
      });
    });
  }

  getAll(): Promise<Array<Chambre>> {
    return new Promise((resolve, reject) => {
      const listString = localStorage.getItem('hotel-chambres');
      if (listString) {
        resolve(JSON.parse(listString));
      } else {
        resolve([]);
      }
    });
  }

  getAllFromFirebase(): Promise<Array<Chambre>> {
    return new Promise((resolve, reject) => {
      if (this.authService.hotelGlobal && this.authService.hotelGlobal.id) {
        const idhotel = this.authService.hotelGlobal.id;
        const chambres = new Array<Chambre>();
        const db = firebase.firestore();
        db.collection('chambres').where('idhotel', '==', idhotel).get().then((resultats) => {
          console.log('La liste des chambres a été récupérée');
          resultats.forEach((resultat) => {
            const chambre = resultat.data() as Chambre;
            chambres.push(chambre);
          });
          console.log('chambres');
          console.log(chambres);
          resolve(chambres);
        });
      }
    });
  }

  save(chambre: Chambre) {
    const nouvelleListe = [];
    let nouveau = true;
    return new Promise((resolve, reject) => {
      this.getAll().then((chambres) => {
        chambres.forEach((c) => {
          if (c.roomId === chambre.roomId) {
            nouvelleListe.push(chambre);
            nouveau = false;
          } else {
            nouvelleListe.push(c);
          }
        });
        if (nouveau) {
          nouvelleListe.push(chambre);
        }
        this.saveToFirebase(chambre).then(() => {
          localStorage.setItem('hotel-chambres', JSON.stringify(nouvelleListe));
          resolve(nouvelleListe);
        });
      });
    });
  }

  saveToFirebase(chambre: Chambre) {
    return new Promise((resolve, reject) => {
      console.log('saveToFirebase');
      let c: Chambre;
      if (this.authService.hotelGlobal && this.authService.hotelGlobal.id) {
        console.log(this.authService.hotelGlobal.id);
        const idhotel = this.authService.hotelGlobal.id;
        chambre.idhotel = idhotel;
        const db = firebase.firestore();
        c = JSON.parse(JSON.stringify(chambre));
        db.collection('chambres').doc(idhotel + '-CHAMBRE-' + c.roomId).set(c).then(() => {
          console.log('La chambre a bien été enregistrée');
          resolve(c);
        });
      }
    });
  }

  delete(chambre: Chambre) {
    const nouvelleListe = [];
    return new Promise((resolve, reject) => {
      this.getAll().then((chambres) => {
        chambres.forEach((c) => {
          if (c.roomId === chambre.roomId) {
          } else {
            nouvelleListe.push(c);
          }
        });
        localStorage.setItem('hotel-chambres', JSON.stringify(nouvelleListe));
        resolve(nouvelleListe);
      });
    });
  }
}
