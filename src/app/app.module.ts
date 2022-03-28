import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app.routing.module';
import { AppMaterialModule } from './app.material.module';

import { AppComponent } from './app.component';
import { PageSchedulerComponent } from './components/page-scheduler/page-scheduler.component';
import { FormReservationComponent } from './components/form-reservation/form-reservation.component';
import { ReservationService } from './service/reservation-service';
import { ShedulerModule } from './scheduler/scheduler.module';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { ChambreListComponent } from './components/chambre-list/chambre-list.component';
import { ChambreEditComponent } from './components/chambre-edit/chambre-edit.component';
// tslint:disable-next-line:max-line-length
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatButtonToggleModule, MatToolbarModule, MatIconModule, MatDatepickerModule, NativeDateModule } from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import { LayoutModule } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { PaiementListComponent } from './components/paiement-list/paiement-list.component';
import { ReservationEditComponent } from './components/reservation-edit/reservation-edit.component';
import { PaiementEditComponent } from './components/paiement-edit/paiement-edit.component';
import { RepasEditComponent } from './components/repas-edit/repas-edit.component';
import { RepasListComponent } from './components/repas-list/repas-list.component';
import { FactureVoirComponent } from './components/facture-voir/facture-voir.component';
import { InfoUtilisateurComponent } from './components/info/info-utilisateur/info-utilisateur.component';
import { InfoHotelComponent } from './components/info/info-hotel/info-hotel.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UtilisateurListComponent } from './components/utilisateur-list/utilisateur-list.component';
import { UtilisateurEditComponent } from './components/utilisateur-edit/utilisateur-edit.component';
import { BlancheComponent } from './components/blanche/blanche.component';

// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    PageSchedulerComponent,
    FormReservationComponent,
    ConnexionComponent,
    PaiementListComponent,
    PaiementEditComponent,
    ReservationListComponent,
    ReservationEditComponent,
    ChambreListComponent,
    ChambreEditComponent,
    RepasListComponent,
    RepasEditComponent,
    FactureVoirComponent,
    InfoHotelComponent,
    InfoUtilisateurComponent,
    UtilisateurListComponent,
    UtilisateurEditComponent,
    BlancheComponent,
  ],
  entryComponents: [
    FormReservationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppMaterialModule,
    ShedulerModule,
    AppRoutingModule,
    CommonModule,
    LayoutModule,
    OverlayModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatDatepickerModule,
    MatSnackBarModule,
    NativeDateModule,
    MatTabsModule,
  ],
  providers: [
    ReservationService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {provide: LOCALE_ID, useValue: 'fr' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
