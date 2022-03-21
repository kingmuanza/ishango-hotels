import { Repas } from './repasdto';

import * as uuid from 'uuid';

export class RepasReservation {
    id: string;
    repas: Repas;
    quantite = 1;
    idreservation: string;

    constructor() {
        this.id = uuid.v4();
    }
}
