import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfoHotelComponent } from './components/info/info-hotel/info-hotel.component';
import { InfoUtilisateurComponent } from './components/info/info-utilisateur/info-utilisateur.component';
import { ChambreEditComponent } from './components/chambre-edit/chambre-edit.component';
import { ChambreListComponent } from './components/chambre-list/chambre-list.component';
import { FactureVoirComponent } from './components/facture-voir/facture-voir.component';

import { PageSchedulerComponent } from './components/page-scheduler/page-scheduler.component';
import { PaiementEditComponent } from './components/paiement-edit/paiement-edit.component';
import { PaiementListComponent } from './components/paiement-list/paiement-list.component';
import { RepasEditComponent } from './components/repas-edit/repas-edit.component';
import { RepasListComponent } from './components/repas-list/repas-list.component';
import { ReservationEditComponent } from './components/reservation-edit/reservation-edit.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { CalendarSearchOutComponent } from './scheduler/calendar-search/calendar-searchout.component';
import { UtilisateurEditComponent } from './components/utilisateur-edit/utilisateur-edit.component';
import { UtilisateurListComponent } from './components/utilisateur-list/utilisateur-list.component';
import { BlancheComponent } from './components/blanche/blanche.component';

const routes: Routes = [
  { path: '', redirectTo: 'blanche', pathMatch: 'full' },
  { path: 'blanche', component: BlancheComponent },
  { path: 'dashboard', component: PageSchedulerComponent },

  { path: 'paiements', component: PaiementListComponent },
  { path: 'paiements/edit', component: PaiementEditComponent },
  { path: 'paiements/edit/:id', component: PaiementEditComponent },

  { path: 'reservations', component: ReservationListComponent },
  { path: 'reservations/edit', component: ReservationEditComponent },
  { path: 'reservations/edit/:id', component: ReservationEditComponent },

  { path: 'facture/voir/:id', component: FactureVoirComponent },

  { path: 'hotel', component: InfoHotelComponent },
  { path: 'compte', component: InfoUtilisateurComponent },

  { path: 'chambres', component: ChambreListComponent },
  { path: 'chambres/edit', component: ChambreEditComponent },
  { path: 'chambres/edit/:id', component: ChambreEditComponent },

  { path: 'utilisateurs', component: UtilisateurListComponent },
  { path: 'utilisateurs/edit', component: UtilisateurEditComponent },
  { path: 'utilisateurs/edit/:id', component: UtilisateurEditComponent },

  { path: 'repas', component: RepasListComponent },
  { path: 'repas/edit', component: RepasEditComponent },
  { path: 'repas/edit/:id', component: RepasEditComponent },

  { path: '**', redirectTo: 'blanche' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
