import { Injectable } from '@angular/core';
import { RepasReservation } from '../model/repas.reservation.model';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class RepasReservationService {

  constructor() { }

  saveToFirebase(repasReservation: RepasReservation) {
    return new Promise((resolve, reject) => {
      console.log('saveToFirebase');
      let c: RepasReservation;
      const db = firebase.firestore();
      c = JSON.parse(JSON.stringify(repasReservation));
      db.collection('repas-reservation').doc(c.id).set(c).then(() => {
        console.log('La repas a bien été enregistré');
        resolve(c);
      });

    });
  }

  getAllFromFirebase(idreservation: string): Promise<Array<RepasReservation>> {
    return new Promise((resolve, reject) => {
      const repasReservations = new Array<RepasReservation>();
      const db = firebase.firestore();
      db.collection('repas-reservation').where('idreservation', '==', idreservation).get().then((resultats) => {
        console.log('La liste des repas a été récupérée');
        resultats.forEach((resultat) => {
          const repasReservation = resultat.data() as RepasReservation;
          repasReservations.push(repasReservation);
        });
        console.log('repasReservations');
        console.log(repasReservations);
        resolve(repasReservations);
      });

    });
  }

}
