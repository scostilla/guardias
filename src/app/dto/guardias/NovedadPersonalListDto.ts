import { TipoLicenciaListDto } from './TipoLicenciaListDto';

export class NovedadPersonalListDto {
    id: number;
    fechaInicio: Date;
    fechaFinal: Date;
    horaInicio: Date;
    horaFinal: Date;
    tipoLicencia: TipoLicenciaListDto;


        constructor (
            id: number,
            fechaInicio: Date,
            fechaFinal: Date,
            horaInicio: Date,
            horaFinal: Date,
            tipoLicencia: TipoLicenciaListDto,
        ){
            this.id = id;
            this.fechaInicio = fechaInicio;
            this.fechaFinal = fechaFinal;
            this.horaInicio = horaInicio;
            this.horaFinal = horaFinal;
            this.tipoLicencia = tipoLicencia;
        }
    }
