import { Injectable } from '@angular/core';
import { BookingDto } from '../model/bookingdto';
import { Paiement } from '../model/paiementdto';
import { AuthentificationService } from './authentification.service';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  constructor(
    private authService: AuthentificationService,
  ) { }

  public get(id: string): Paiement {
    let booking: Paiement;
    const liste = this.getAll();
    liste.forEach((b) => {
      if (b.id === id) {
        booking = b;
      }
    });
    return booking;
  }


  saveToFirebase(paiement: Paiement): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('saveToFirebase');
      let p: Paiement;
      if (this.authService.hotelGlobal && this.authService.hotelGlobal.id) {
        console.log(this.authService.hotelGlobal.id);
        const idhotel = this.authService.hotelGlobal.id;
        paiement.idhotel = idhotel;
        const db = firebase.firestore();
        p = JSON.parse(JSON.stringify(paiement));
        db.collection('paiements').doc(idhotel + '-PAIEMENT-' + paiement.id).set(p).then(() => {
          console.log('La paiement a bien été enregistrée');
          resolve(true);
        });
      }
    });
  }



  public save(paiement: Paiement) {
    return new Promise((resolve, reject) => {
      this.saveToFirebase(paiement).then(() => {
        const all = this.getAll();
        all.push(paiement);
        localStorage.setItem('ishango-hotels-paiements', JSON.stringify(all));
        resolve(paiement);
      });
    });
  }

  public delete(paiement: Paiement) {
    const all = this.getAll();
    const liste = [];
    liste.forEach((b) => {
      if (b.id === paiement.id) {

      } else {
        liste.push(b);
      }
    });
    localStorage.setItem('ishango-hotels-paiements', JSON.stringify(liste));
  }

  public getAllOfTReservation(reservation: BookingDto): Paiement[] {

    const all = this.getAll();
    const liste = [];
    all.forEach((b) => {
      if (b.bookingID === reservation.bookingId) {
        liste.push(b);
      }
    });
    return liste;
  }

  public getAll(): Paiement[] {
    const liste = [];
    const paiementstring = localStorage.getItem('ishango-hotels-paiements');
    if (paiementstring) {
      // console.log('Calendar bookings');
      const paiements = JSON.parse(paiementstring) as Array<Paiement>;
      // console.log(paiements);
      paiements.forEach((paiement) => {
        const b = paiement;
        b.date = new Date(b.date);
        liste.push(b);
      });
    }
    return liste;
  }
}
