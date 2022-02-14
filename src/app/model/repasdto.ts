
import * as uuid from 'uuid';
export class Repas {
    id: string;
    idhotel: string;
    code: string;
    nom: string;
    cout: number;

    constructor() {
        this.id = uuid.v4();
    }
}
