export class LegajoDto {
    fechaInicio: Date | null;
    fechaFinal?: Date | null;
    esAutoridad: boolean;
    activo: boolean;
    matriculaNacional?: string  | null;
    matriculaProvincial: string;
    idSuspencion?: number | null;
    motivoBaja?: string | null;
    idRevista?: number | null;
    idUdo?: number  | null;
    idPersona: number;
    idEfectores?: number[]  | null;
    idEspecialidades?: number[] | null;
    idProfesion: number;
    idTipoGuardias?: number[] | null;
  
    constructor(
      fechaInicio: Date | null,
      esAutoridad: boolean,
      activo: boolean,
      matriculaProvincial: string,
      idPersona: number,
      idProfesion: number,
  
      // Parámetros opcionales
      fechaFinal?: Date | null,
      matriculaNacional?: string | null,
      idSuspencion?: number | null,
      motivoBaja?: string | null,
      idRevista?: number | null,
      idUdo?: number  | null,
      idEfectores?: number[]  | null,
      idEspecialidades?: number[] | null,
      idTipoGuardias?: number[] | null
    ) {
      this.fechaInicio = fechaInicio;
      this.fechaFinal = fechaFinal ?? null;
      this.esAutoridad = esAutoridad;
      this.activo = activo;
      this.matriculaNacional = matriculaNacional ?? null;
      this.matriculaProvincial = matriculaProvincial;
      this.idSuspencion = idSuspencion ?? null;
      this.motivoBaja = motivoBaja ?? null;
      this.idRevista = idRevista;
      this.idUdo = idUdo;
      this.idPersona = idPersona;
      this.idEfectores = idEfectores;
      this.idEspecialidades = idEspecialidades ?? null;
      this.idProfesion = idProfesion;
      this.idTipoGuardias = idTipoGuardias ?? null;
    }
  }
  