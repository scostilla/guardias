import { AsistencialDetailDto } from './Configuracion/asistencial/AsistencialDetailDto';

export class FacturaSummaryDto {
  id: number;
  asistencial: AsistencialDetailDto;
      constructor(
        id: number,
        asistencial: AsistencialDetailDto,
    ) {
        this.id = id;
        this.asistencial = asistencial;
    }

}
