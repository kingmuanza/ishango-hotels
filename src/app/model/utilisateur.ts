export class Utilisateur {
    id: string;
    login: string;
    nom: string;
    passe: string;
    actif: boolean;
    idhotel: string;
    dateCreation: Date;
    profil: string;

    constructor() {
        this.id = 'U_' + new Date().getTime();
    }
}
