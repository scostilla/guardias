import { AsistencialDetailDto } from 'src/app/dto/Configuracion/asistencial/AsistencialDetailDto';

export class CronogramaTentativoListAtorizadoDto {
    id: number;
    asistencial: AsistencialDetailDto;  
    idEfector: number; 
    tipoGuardia: string;
    fechaIngreso: Date;
    fechaEgreso: Date;
    horaIngreso: Date;
    horaEgreso: Date;
    autorizado: string;
    motivoAutorizacion?: string | null;
    motivoPendiente: string;
    idAutoridad?: number | null;


    constructor(
        id: number,
        asistencial: AsistencialDetailDto,  
        idEfector: number, 
        tipoGuardia: string,
        fechaIngreso: Date,
        fechaEgreso: Date,
        horaIngreso: Date,
        horaEgreso: Date,
        autorizado: string,
        motivoPendiente: string,
        motivoAutorizacion?: string | null,
        idAutoridad?: number | null,
    ) {
        this.id = id;
        this.asistencial = asistencial;
        this.idEfector = idEfector;
        this.tipoGuardia = tipoGuardia;
        this.fechaIngreso = fechaIngreso;
        this.fechaEgreso = fechaEgreso;
        this.horaIngreso = horaIngreso;
        this.horaEgreso = horaEgreso;
        this.autorizado = autorizado;
        this.motivoAutorizacion = motivoAutorizacion;
        this.motivoPendiente = motivoPendiente;
        this.idAutoridad = idAutoridad;
    }
  
  }