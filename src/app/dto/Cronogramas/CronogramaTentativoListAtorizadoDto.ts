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
      }
  
  }