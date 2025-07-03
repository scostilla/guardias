export class EstadoDdjjDto {
    idDdjj: number;
    idDirector: number;
    idDirectorDPH: number;
    estadoDdjjDirector: string;
    estadoDdjjDirectorDPH: string;
    enPosesionDirector: boolean;
    enPosesionDirectorDPH: boolean;
    motivoDirector: string;
    motivoDirectorDPH: string;

    constructor(
        idDdjj: number,
        idDirector: number,
        idDirectorDPH: number,
        estadoDdjjDirector: string,
        estadoDdjjDirectorDPH: string,
        enPosesionDirector: boolean,
        enPosesionDirectorDPH: boolean,
        motivoDirector: string,
        motivoDirectorDPH: string
    ) {

        this.idDdjj = idDdjj; 
        this.idDirector = idDirector;
        this.idDirectorDPH = idDirectorDPH;
        this.estadoDdjjDirector = estadoDdjjDirector;
        this.estadoDdjjDirectorDPH = estadoDdjjDirectorDPH;
        this.enPosesionDirector = enPosesionDirector;
        this.enPosesionDirectorDPH = enPosesionDirectorDPH;
        this.motivoDirector = motivoDirector;
        this.motivoDirectorDPH = motivoDirectorDPH;   
    }
}