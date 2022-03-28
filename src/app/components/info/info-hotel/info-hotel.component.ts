import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Utility } from 'src/app/appcore/utility';
import { Hotel } from 'src/app/model/hotel';
import { AuthentificationService } from 'src/app/service/authentification.service';
import { HotelService } from 'src/app/service/hotel.service';
import firebase from 'firebase';

@Component({
  selector: 'app-info-hotel',
  templateUrl: './info-hotel.component.html',
  styleUrls: ['./info-hotel.component.css']
})
export class InfoHotelComponent implements OnInit {

  @ViewChild('logo') logo: ElementRef<HTMLElement>;
  hotel = new Hotel();
  modification = false;
  id: string;
  url: any;
  nom: string;

  constructor(
    private hotelService: HotelService,
    private authService: AuthentificationService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    console.log('this.hotel');
    console.log(this.hotel);
    if (this.authService.hotelGlobal) {
      this.hotel = this.authService.hotelGlobal;
      if (this.hotel.logo) {
        this.url = this.hotel.logo;
      }
      this.hotelService.get(this.authService.hotelGlobal.id).then((hotel) => {
        this.hotel = hotel;
        if (this.hotel.logo) {
          this.url = this.hotel.logo;
        }
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  onConfirm(form: NgForm) {
    if (form.invalid === true) {
      return;
    }
    this.hotel.tel = Utility.toString(form.value.code);
    this.hotel.nom = Utility.toString(form.value.nom);
    this.hotel.email = Utility.toString(form.value.cout);
    console.log('this.hotel');
    console.log(this.hotel);

    this.hotelService.save(this.hotel).then(() => {
      this.router.navigate(['hotel']);
    });
  }

  enregistrer() {
    if (this.nom) {
      this.saveImageToFirebase().then((url) => {
        this.hotel.logo = url;
        if (this.hotel.nom) {
          this.hotelService.save(this.hotel).then(() => {
            this.openSnackBar('Enregistré avec succès', 'Fermer');
          });
        }
      });
    } else {
      if (this.hotel.nom) {
        this.hotelService.save(this.hotel).then(() => {
          this.openSnackBar('Enregistré avec succès', 'Fermer');
        });
      }
    }
  }

  supprimer() {
    const oui = confirm('Etes-vous sûr de vouloir supprimer cette hotel');
    if (oui) {
      this.hotelService.delete(this.hotel).then(() => {
        this.router.navigate(['hotel']);
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
        const reference = storageRef.child('images/' + this.hotel.id + '/' + this.nom);
        console.log(reference);
        reference.putString(this.url, 'data_url').then((snapshot) => {
          console.log('Uploaded a blob or file!');
          resolve(snapshot.ref.getDownloadURL());
        });
      }
    });
  }
}
