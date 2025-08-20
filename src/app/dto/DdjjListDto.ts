import { RegistroMensualListDto } from './RegistroMensualListDto';

export class DdjjListDto {
  id: number;
  mes: string;
  anio: number;
  registrosMensuales: RegistroMensualListDto[];
  idDirector: number;
  idDirectorDPH: number;
  estadoDdjjDirector: string;
  estadoDdjjDirectorDPH: string;
  enPosesionDirector: boolean;
  enPosesionDirectorDPH: boolean;
  motivoDirector: string;
  motivoDirectorDPH: string;
  idTipoGuardia: number;

      constructor(
        id: number,
        mes: string,
        anio: number,
        registrosMensuales: RegistroMensualListDto[],
        idDirector: number,
        idDirectorDPH: number,
        estadoDdjjDirector: string,
        estadoDdjjDirectorDPH: string,
        enPosesionDirector: boolean,
        enPosesionDirectorDPH: boolean,
        motivoDirector: string,
        motivoDirectorDPH: string,
        idTipoGuardia: number,
    ) {

        this.id = id; 
        this.mes = mes;
        this.anio = anio;
        this.registrosMensuales = registrosMensuales;
        this.idDirector = idDirector;
        this.idDirectorDPH = idDirectorDPH;
        this.estadoDdjjDirector = estadoDdjjDirector;
        this.estadoDdjjDirectorDPH = estadoDdjjDirectorDPH;
        this.enPosesionDirector = enPosesionDirector;
        this.enPosesionDirectorDPH = enPosesionDirectorDPH;
        this.motivoDirector = motivoDirector;
        this.motivoDirectorDPH = motivoDirectorDPH;
        this.idTipoGuardia = idTipoGuardia;
    }
}
