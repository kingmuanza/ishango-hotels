import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Utilisateur } from '../model/utilisateur';
import { AuthentificationService } from './authentification.service';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  utilisateurs = [];

  constructor(
    private authService: AuthentificationService,
  ) {
    this.getAll().then((all) => {
      this.utilisateurs = all;
      console.log(this.utilisateurs);
    });

  }

  get(id: string): Promise<Utilisateur> {
    let utilisateur: Utilisateur;
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('utilisateurs').doc(id).get().then((resultat) => {
        console.log('La liste des utilisateurs a été récupérée');
        utilisateur = resultat.data() as Utilisateur;
        console.log('utilisateur');
        console.log(utilisateur);
        resolve(utilisateur);
      });
    });
  }

  getAll(): Promise<Array<Utilisateur>> {
    return new Promise((resolve, reject) => {
      const listString = localStorage.getItem('utilisateur-utilisateurs');
      if (listString) {
        resolve(JSON.parse(listString));
      } else {
        resolve([]);
      }
    });
  }

  getAllFromFirebase(): Promise<Array<Utilisateur>> {
    return new Promise((resolve, reject) => {
      if (this.authService.utilisateurGlobal && this.authService.utilisateurGlobal.id) {
        const idutilisateur = this.authService.utilisateurGlobal.id;
        const utilisateurs = new Array<Utilisateur>();
        const db = firebase.firestore();
        db.collection('utilisateurs').where('idutilisateur', '==', idutilisateur).get().then((resultats) => {
          console.log('La liste des utilisateurs a été récupérée');
          resultats.forEach((resultat) => {
            const utilisateur = resultat.data() as Utilisateur;
            utilisateurs.push(utilisateur);
          });
          console.log('utilisateurs');
          console.log(utilisateurs);
          resolve(utilisateurs);
        });
      }
    });
  }

  enregistrer(utilisateur: Utilisateur) {
    return new Promise((resolve, reject) => {
      this.saveToFirebase(utilisateur).then(() => {
        resolve(utilisateur);
      });
    });
  }

  save(utilisateur: Utilisateur) {
    const nouvelleListe = [];
    let nouveau = true;
    return new Promise((resolve, reject) => {
      this.getAll().then((utilisateurs) => {
        utilisateurs.forEach((c) => {
          if (c.id === utilisateur.id) {
            nouvelleListe.push(utilisateur);
            nouveau = false;
          } else {
            nouvelleListe.push(c);
          }
        });
        if (nouveau) {
          nouvelleListe.push(utilisateur);
        }
        this.saveToFirebase(utilisateur).then(() => {
          localStorage.setItem('ishango-utilisateur', JSON.stringify(utilisateur));
          this.authService.utilisateurGlobal = utilisateur;
          resolve(nouvelleListe);
        });
      });
    });
  }

  saveToFirebase(utilisateur: Utilisateur) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      const c = JSON.parse(JSON.stringify(utilisateur));
      db.collection('utilisateurs').doc(utilisateur.id).set(c).then(() => {
        console.log('l utilisateur a bien été enregistré');
        resolve(c);
      });
    });
  }

  getFromFirebase(id: string): Promise<Utilisateur> {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('utilisateurs').doc(id).get().then((resultat) => {
        console.log('l utilisateur a bien été enregistré');
        const utilisateur = resultat.data() as Utilisateur;
        resolve(utilisateur);
      });
    });
  }

  getWithLogin(login: string): Promise<Array<Utilisateur>> {
    const utilisateurs = new Array<Utilisateur>();
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('utilisateurs').where('login', '==', login).get().then((resultats) => {
        console.log('l utilisateur a bien été enregistré');
        resultats.forEach((resultat) => {
          const utilisateur = resultat.data() as Utilisateur;
          utilisateurs.push(utilisateur);
        });
        resolve(utilisateurs);
      });
    });
  }

  getAllFromHotel(idhotel: string): Promise<Array<Utilisateur>> {
    const utilisateurs = new Array<Utilisateur>();
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('utilisateurs').where('idhotel', '==', idhotel).get().then((resultats) => {
        console.log('l utilisateur a bien été enregistré');
        resultats.forEach((resultat) => {
          const utilisateur = resultat.data() as Utilisateur;
          utilisateurs.push(utilisateur);
        });
        resolve(utilisateurs);
      });
    });
  }

  delete(utilisateur: Utilisateur) {
    const nouvelleListe = [];
    return new Promise((resolve, reject) => {
      this.getAll().then((utilisateurs) => {
        utilisateurs.forEach((c) => {
          if (c.id === utilisateur.id) {
          } else {
            nouvelleListe.push(c);
          }
        });
        localStorage.setItem('utilisateur-utilisateurs', JSON.stringify(nouvelleListe));
        resolve(nouvelleListe);
      });
    });
  }


}
