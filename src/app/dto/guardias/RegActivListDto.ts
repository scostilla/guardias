import { TipoGuardiaListDto } from './TipoGuardiaListDto';
import { SumaHorasListDto } from './SumaHorasListDto';

export class RegActivListDto {
  id: number;
  fechaIngreso: Date; // formato: 'YYYY-MM-DD'
  fechaEgreso: Date;  // formato: 'YYYY-MM-DD'
  horaIngreso: Date;  // formato: 'HH:mm'
  horaEgreso: Date;   // formato: 'HH:mm'
  tipoGuardia: TipoGuardiaListDto;
  horasRealizadas: SumaHorasListDto;

    constructor (
        id: number,
        fechaIngreso: Date, // formato: 'YYYY-MM-DD'
        fechaEgreso: Date,  // formato: 'YYYY-MM-DD'
        horaIngreso: Date,  // formato: 'HH:mm'
        horaEgreso: Date,   // formato: 'HH:mm'
        tipoGuardia: TipoGuardiaListDto,
        horasRealizadas: SumaHorasListDto
    ){
        this.id = id;
        this.fechaIngreso = fechaIngreso;
        this.fechaEgreso= fechaEgreso;
        this.horaIngreso = horaIngreso;
        this.horaEgreso = horaEgreso;
        this.tipoGuardia = tipoGuardia;
        this.horasRealizadas = horasRealizadas;
    }
}
