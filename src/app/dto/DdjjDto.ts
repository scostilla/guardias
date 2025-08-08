export class DdjjDto {
  mes: string;               // enum
  anio: number;                // >= 1991
  activo: boolean;             
  subtotal: number;            // BigDecimal -> number
  total: number;               // BigDecimal -> number
  idValorGmi?: number | null;  // opcional
  idEfector: number;
  idRegistrosMensuales: number[];
  idDirector?: number | null;
  idDirectorDPH?: number | null;
  estadoDdjjDirector: string;
  estadoDdjjDirectorDPH?: string | null;
  enPosesionDirector?: boolean | null;
  enPosesionDirectorDPH?: boolean | null;
  motivoDirector?: string | null;
  motivoDirectorDPH?: string | null;
  idTipoGuardia: number;

      constructor(
        mes: string,               // enum
        anio: number,                // >= 1991
        activo: boolean,             
        subtotal: number,            // BigDecimal -> number
        total: number,
        idEfector: number,
        idRegistrosMensuales: number[],
        estadoDdjjDirector: string,
        idTipoGuardia: number,
        idValorGmi?: number | null,  // opcional
        idDirector?: number | null,
        idDirectorDPH?: number | null,
        estadoDdjjDirectorDPH?: string | null,
        enPosesionDirector?: boolean | null,
        enPosesionDirectorDPH?: boolean | null,
        motivoDirector?: string | null,
        motivoDirectorDPH?: string | null,
    ) {

        this.mes = mes; 
        this.anio = anio;
        this.activo = activo;
        this.subtotal = subtotal;
        this.total = total;
        this.idValorGmi = idValorGmi;
        this.idEfector = idEfector;
        this.idRegistrosMensuales = idRegistrosMensuales;
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
