import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Utility } from 'src/app/appcore/utility';
import { Repas } from 'src/app/model/repasdto';
import { RepasService } from 'src/app/service/repas.service';

@Component({
  selector: 'app-repas-edit',
  templateUrl: './repas-edit.component.html',
  styleUrls: ['./repas-edit.component.css']
})
export class RepasEditComponent implements OnInit {

  repas = new Repas();
  modification = false;
  id: string;

  constructor(
    private repasService: RepasService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.id = id;
      if (id) {
        this.modification = true;
        this.repasService.get(id).then((repas) => {
          this.repas = repas;
        });
      }
    });
  }

  onConfirm(form: NgForm) {
    if (form.invalid === true) {
      return;
    }
    this.repas.code = Utility.toString(form.value.code);
    this.repas.nom = Utility.toString(form.value.nom);
    this.repas.cout = Utility.toInteger(form.value.cout);
    console.log('this.repas');
    console.log(this.repas);

    this.repasService.save(this.repas).then(() => {
      this.router.navigate(['repas']);
    });
  }

  supprimer() {
    const oui = confirm('Etes-vous sûr de vouloir supprimer cette repas');
    if (oui) {
      this.repasService.delete(this.repas).then(() => {
        this.router.navigate(['repas']);
      });
    }

  }

}
