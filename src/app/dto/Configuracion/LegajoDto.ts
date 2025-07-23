export class LegajoDto {
  fechaInicio: Date | null;
  fechaFinal?: Date | null;
  esAutoridad: boolean;
  esRegional?: boolean;
  activo: boolean;
  url: string;
  matriculaNacional?: string | null;
  matriculaProvincial?: string | null;
  idSuspencion?: number | null;
  motivoBaja?: string | null;
  idRevista?: number | null;
  idUdo?: number  | null;
  idPersona: number;
  idEfectores?: number[]  | null;
  idEspecialidades?: number[] | null;
  idProfesion?: number | null;
  idTipoGuardias?: number[] | null;
  idCargo?: number | null;
  idRegion?: number | null;
  nroResolucion?: string;  // solo para autoridad
  nroDecreto?: string; // solo para autoridad
  fechaResolucion?: string;  // solo para autoridad
  tipoEfector?: string;
  tipoEfectorCargo?: string; // nuevo campo para tipo de efector en cargo
  tipoUdo?: string;
  fechaBajaSistema?: string;  // esto lo carga el back
  

  constructor(
    fechaInicio: Date | null,
    esAutoridad: boolean,
    activo: boolean,
    url: string,
    idPersona: number,

    // Parámetros opcionales
    fechaFinal?: Date | null,
    esRegional?: boolean,
    matriculaNacional?: string | null,
    matriculaProvincial?: string | null,
    idSuspencion?: number | null,
    motivoBaja?: string | null,
    idRevista?: number | null,
    idUdo?: number  | null,
    idEfectores?: number[]  | null,
    idEspecialidades?: number[] | null,
    idProfesion?: number | null,
    idTipoGuardias?: number[] | null,
    idCargo?: number | null,
    idRegion?: number | null,
    nroResolucion?: string,  // solo para autoridad
    nroDecreto?: string, // solo para autoridad
    fechaResolucion?: string,  // solo para autoridad
    tipoEfector?: string,
    tipoEfectorCargo?: string, // nuevo campo para tipo de efector en cargo
    tipoUdo?: string,
    fechaBajaSistema?: string,  // esto lo carga el back  
  
  ) {
    this.fechaInicio = fechaInicio;
    this.fechaFinal = fechaFinal ?? null;
    this.esAutoridad = esAutoridad;
    this.esRegional = esRegional;
    this.activo = activo;
    this.url = url;
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
    this.idCargo = idCargo ?? null;
    this.idRegion = idRegion ?? null;
    this.nroResolucion = nroResolucion ?? undefined;
    this.nroDecreto = nroDecreto ?? undefined;
    this.fechaResolucion = fechaResolucion ?? undefined;
    this.tipoEfector = tipoEfector ?? undefined;
    this.tipoEfectorCargo = tipoEfectorCargo ?? undefined; // nuevo campo para tipo de efector en cargo
    this.tipoUdo = tipoUdo ?? undefined
    this.fechaBajaSistema = fechaBajaSistema ?? undefined;
    
  }
}