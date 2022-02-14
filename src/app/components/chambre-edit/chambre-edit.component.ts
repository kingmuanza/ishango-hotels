import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Utility } from 'src/app/appcore/utility';
import { Chambre } from 'src/app/model/chambredto';
import { ChambreService } from 'src/app/service/chambre.service';

@Component({
  selector: 'app-chambre-edit',
  templateUrl: './chambre-edit.component.html',
  styleUrls: ['./chambre-edit.component.css']
})
export class ChambreEditComponent implements OnInit {

  chambre = new Chambre();
  modification = false;
  id: string;

  constructor(
    private chambreService: ChambreService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.id = id;
      if (id) {
        const i = Utility.toInteger(id);
        this.modification = true;
        this.chambreService.get(i).then((chambre) => {
          this.chambre = chambre;
        });
      }
    });
  }

  onConfirm(form: NgForm) {
    if (form.invalid === true) {
      return;
    }
    this.chambre.roomId = Utility.toInteger(form.value.porte);
    this.chambre.roomNumber = Utility.toString(form.value.nom);
    this.chambre.roomTypeName = Utility.toString(form.value.type);
    const type = Utility.toString(form.value.type);
    if (type === 'Single') {
      this.chambre.roomType = 1;
    }
    if (type === 'Double') {
      this.chambre.roomType = 2;
    }
    if (type === 'Suite') {
      this.chambre.roomType = 3;
    }
    if (type === 'Presidentielle') {
      this.chambre.roomType = 4;
    }
    this.chambre.cout = Utility.toInteger(form.value.cout);
    console.log('this.chambre');
    console.log(this.chambre);

    this.chambreService.save(this.chambre).then(() => {
      this.router.navigate(['chambres']);
    });
  }

  supprimer() {
    const oui = confirm('Etes-vous sûr de vouloir supprimer cette chambre');
    if (oui) {
      this.chambreService.delete(this.chambre).then(() => {
        this.router.navigate(['chambres']);
      });
    }

  }

}
