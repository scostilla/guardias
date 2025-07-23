import { Cargo } from './Cargo';
import { Efector } from './Efector';
import { Especialidad } from './Especialidad';
import { Person } from './Person';
import { Profesion } from './Profesion';
import { Region } from './Region';
import { Revista } from './Revista';
import { Suspension } from './Suspension';
import { TipoGuardia } from './TipoGuardia';


export class Legajo {
    id?: number | null;
    fechaInicio: Date | null;
    fechaFinal?: Date | null;
    esAutoridad: boolean;
    esRegional?: boolean;
    activo:boolean;
    url: string;
    matriculaNacional?: string | null;
    matriculaProvincial?: string | null;
    motivoBaja?: string | null; 
    suspencion?: Suspension | null;
    revista?:Revista | null;
    udo?: Efector | null;
    persona?: Person | null;
    efectores: Efector[];
    especialidades: Especialidad[];
    profesion?: Profesion | null;
    tipoGuardias: TipoGuardia[];
    cargo?: Cargo | null;
    region?: Region | null;
    nroresolucion?: string;
    nrodecreto?: string;
    fechaResolucion?: string;
    tipoEfector?: string;
    tipoEfectorCargo?: string;
    tipoUdo?: string;
    fechaBajaSistema?: string;
   
    
    constructor(
        fechaInicio: Date | null,
        esAutoridad: boolean,
        activo:boolean,
        url: string,
        efectores: Efector[],
        especialidades: Especialidad[],
        tipoGuardias: TipoGuardia[],

        // Parámetros opcionales
        fechaFinal?: Date | null,
        esRegional?: boolean,
        matriculaNacional?: string | null,
        matriculaProvincial?: string | null,
        motivoBaja?: string | null,
        suspencion?: Suspension | null,
        revista?:Revista | null,
        udo?: Efector | null,
        persona?: Person | null,
        profesion?: Profesion | null,
        cargo?: Cargo | null,
        region?: Region | null,
        nroresolucion?: string,
        nrodecreto?: string,
        fechaResolucion?: string,
        tipoEfector?: string,
        tipoEfectorCargo?: string,
        tipoUdo?: string,
        fechaBajaSistema?: string
      
        ) {
        
        this.fechaInicio = fechaInicio;
        this.fechaFinal = fechaFinal;
        this.esAutoridad = esAutoridad;
        this.esRegional = esRegional;
        this.activo = activo;
        this.url = url;
        this.matriculaNacional = matriculaNacional;
        this.matriculaProvincial = matriculaProvincial;
        this.motivoBaja = motivoBaja;
        this.suspencion = suspencion;
        this.profesion = profesion;
        this.revista = revista;
        this.udo = udo;
        this.persona = persona;
        this.efectores = efectores;
        this.especialidades = especialidades;
        this.tipoGuardias = tipoGuardias;
        this.cargo = cargo;
        this.region = region;
        this.nroresolucion = nroresolucion;
        this.nrodecreto = nrodecreto;
        this.fechaResolucion = fechaResolucion;
        this.tipoEfector = tipoEfector;
        this.tipoEfectorCargo = tipoEfectorCargo;
        this.tipoUdo = tipoUdo;
        this.fechaBajaSistema = fechaBajaSistema;
    
    }

  }