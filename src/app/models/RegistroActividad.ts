import { Person } from "./Configuracion/Person";
import { ServicioSummaryDto } from "src/app/dto/Configuracion/ServicioSummaryDto";
import { Efector } from "./Configuracion/Efector";
import { TipoGuardia } from "./Configuracion/TipoGuardia";
//import { CronogramaDefinitivo } from "./Cronogramas/CronogramaDefinitivo";
import { RegistroMensual } from "./RegistroMensual";
import { RegistrosPendientes } from "./RegistrosPendientes";
import { Usuario } from "./login/Usuario";
import { SumaHoras } from './suma-horas';

export class RegistroActividad {
  id?: number;
  fechaIngreso: string;        // ISO date string
  fechaEgreso?: string | null;
  horaIngreso: string;         // ISO time string
  horaEgreso?: string | null;
  tipoGuardia?: TipoGuardia;
  activo: boolean;
  asistencial?: Person;
  servicio?: ServicioSummaryDto;
  efector?: Efector;
  registroMensual?: RegistroMensual;
  registrosPendientes?: RegistrosPendientes;
  usuarioIngreso?: Usuario;
  usuarioEgreso?: Usuario;
  //cronogramaDefinitivo?: CronogramaDefinitivo;
  fechaRegistroIngreso?: string;
  horaRegistroIngreso?: string;
  fechaRegistroEgreso?: string;
  horaRegistroEgreso?: string;
  horasRealizadas?: SumaHoras;
  motivoIngreso?: string;
  motivoEgreso?: string;
  esGuardiaIncompleta?: boolean;

    constructor(
        fechaIngreso: string,
        horaIngreso: string,
        activo: boolean,
        fechaEgreso?: string | null,
        horaEgreso?: string | null,
        tipoGuardia?: TipoGuardia,
        asistencial?: Person,
        servicio?: ServicioSummaryDto,
        efector?: Efector,
        registroMensual?: RegistroMensual,
        registrosPendientes?: RegistrosPendientes,
        usuarioIngreso?: Usuario,
        usuarioEgreso?: Usuario,
        //cronogramaDefinitivo?: CronogramaDefinitivo,
        fechaRegistroIngreso?: string,
        horaRegistroIngreso?: string,
        fechaRegistroEgreso?: string,
        horaRegistroEgreso?: string,
        horasRealizadas?: SumaHoras,
        motivoIngreso?: string,
        motivoEgreso?: string,
        esGuardiaIncompleta?: boolean,
    ) {

        this.fechaIngreso = fechaIngreso;
        this.fechaEgreso = fechaEgreso;
        this.horaIngreso = horaIngreso;
        this.horaEgreso = horaEgreso;
        this.tipoGuardia = tipoGuardia;
        this.activo = activo;
        this.asistencial = asistencial;
        this.servicio = servicio;
        this.efector = efector;
        this.registroMensual = registroMensual;
        this.registrosPendientes = registrosPendientes;
        this.usuarioIngreso = usuarioIngreso;
        this.usuarioEgreso = usuarioEgreso;
        //this.cronogramaDefinitivo = cronogramaDefinitivo;
        this.fechaRegistroIngreso = fechaRegistroIngreso;
        this.horaRegistroIngreso = horaRegistroIngreso;
        this.fechaRegistroEgreso = fechaRegistroEgreso;
        this.horaRegistroEgreso = horaRegistroEgreso;
        this.horasRealizadas = horasRealizadas;
        this.motivoIngreso = motivoIngreso;
        this.motivoEgreso = motivoEgreso;
        this.esGuardiaIncompleta = esGuardiaIncompleta;
    }
}