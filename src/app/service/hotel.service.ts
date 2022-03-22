import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Hotel } from '../model/hotel';
import { AuthentificationService } from './authentification.service';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  hotels = [];

  constructor(
    private authService: AuthentificationService,
  ) {
    this.getAll().then((all) => {
      this.hotels = all;
      console.log(this.hotels);
    });

  }

  get(id: string): Promise<Hotel> {
    let hotel: Hotel;
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('hotels').doc(id).get().then((resultat) => {
        console.log('La liste des hotels a été récupérée');
        hotel = resultat.data() as Hotel;
        console.log('hotel');
        console.log(hotel);
        resolve(hotel);
      });
    });
  }

  getAll(): Promise<Array<Hotel>> {
    return new Promise((resolve, reject) => {
      const listString = localStorage.getItem('hotel-hotels');
      if (listString) {
        resolve(JSON.parse(listString));
      } else {
        resolve([]);
      }
    });
  }

  getAllFromFirebase(): Promise<Array<Hotel>> {
    return new Promise((resolve, reject) => {
      if (this.authService.hotelGlobal && this.authService.hotelGlobal.id) {
        const idhotel = this.authService.hotelGlobal.id;
        const hotels = new Array<Hotel>();
        const db = firebase.firestore();
        db.collection('hotels').where('idhotel', '==', idhotel).get().then((resultats) => {
          console.log('La liste des hotels a été récupérée');
          resultats.forEach((resultat) => {
            const hotel = resultat.data() as Hotel;
            hotels.push(hotel);
          });
          console.log('hotels');
          console.log(hotels);
          resolve(hotels);
        });
      }
    });
  }

  save(hotel: Hotel) {
    const nouvelleListe = [];
    let nouveau = true;
    return new Promise((resolve, reject) => {
      this.getAll().then((hotels) => {
        hotels.forEach((c) => {
          if (c.id === hotel.id) {
            nouvelleListe.push(hotel);
            nouveau = false;
          } else {
            nouvelleListe.push(c);
          }
        });
        if (nouveau) {
          nouvelleListe.push(hotel);
        }
        this.saveToFirebase(hotel).then(() => {
          localStorage.setItem('ishango-hotel', JSON.stringify(hotel));
          this.authService.hotelGlobal = hotel;
          resolve(nouvelleListe);
        });
      });
    });
  }

  saveToFirebase(hotel: Hotel) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      const c = JSON.parse(JSON.stringify(hotel));
      db.collection('hotels').doc(hotel.id).set(c).then(() => {
        console.log('l hotel a bien été enregistré');
        resolve(c);
      });
    });
  }

  delete(hotel: Hotel) {
    const nouvelleListe = [];
    return new Promise((resolve, reject) => {
      this.getAll().then((hotels) => {
        hotels.forEach((c) => {
          if (c.id === hotel.id) {
          } else {
            nouvelleListe.push(c);
          }
        });
        localStorage.setItem('hotel-hotels', JSON.stringify(nouvelleListe));
        resolve(nouvelleListe);
      });
    });
  }



}
