import { Profesion } from './Profesion';
import { Person } from './Person';
import { Efector } from './Efector';
import { Revista } from './Revista';
import { Especialidad } from './Especialidad';
import { Suspension } from './Suspension';
import { TipoGuardia } from './TipoGuardia';
import { Cargo } from './Cargo';
import { Region } from './Region';


export class Legajo {
    id?: number | null;
    fechaInicio: Date | null;
    fechaFinal?: Date | null;
    esAutoridad: boolean;
    esRegional?: boolean;
    activo:boolean;
    matriculaNacional?: string | null;
    matriculaProvincial: string;
    motivoBaja?: string | null; 
    suspencion?: Suspension | null;
    revista?:Revista | null;
    udo?: Efector | null;
    persona?: Person | null;
    efectores: Efector[];
    especialidades: Especialidad[];
    profesion: Profesion;
    tipoGuardias: TipoGuardia[];
    cargo?: Cargo | null;
    region?: Region | null;
    
    constructor(
        fechaInicio: Date | null,
        esAutoridad: boolean,
        activo:boolean,
        matriculaProvincial: string,
        efectores: Efector[],
        especialidades: Especialidad[],
        profesion: Profesion,
        tipoGuardias: TipoGuardia[],

        // Parámetros opcionales
        fechaFinal?: Date | null,
        esRegional?: boolean,
        matriculaNacional?: string | null,
        motivoBaja?: string | null,
        suspencion?: Suspension | null,
        revista?:Revista | null,
        udo?: Efector | null,
        persona?: Person | null,
        cargo?: Cargo | null,
        region?: Region | null    

        ) {
        
        this.fechaInicio = fechaInicio;
        this.fechaFinal = fechaFinal;
        this.esAutoridad = esAutoridad;
        this.esRegional = esRegional;
        this.activo = activo;
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
    }

  }