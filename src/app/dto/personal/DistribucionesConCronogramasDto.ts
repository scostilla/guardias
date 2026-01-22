import { DistribucionGuardiaDto } from './DistribucionGuardiaDto';
import { DistribucionConsultorioDto } from './DistribucionConsultorioDto';
import { DistribucionGiraDto } from './DistribucionGiraDto';
import { DistribucionOtroDto } from './DistribucionOtroDto';

export class DistribucionesConCronogramasDto {

  guardias: DistribucionGuardiaDto[];
  consultorios: DistribucionConsultorioDto[];
  giras: DistribucionGiraDto[];
  otras: DistribucionOtroDto[];
  crearCronogramasParaGuardias: boolean;

  constructor(
    guardias: DistribucionGuardiaDto[] = [],
    consultorios: DistribucionConsultorioDto[] = [],
    giras: DistribucionGiraDto[] = [],
    otras: DistribucionOtroDto[] = [],
    crearCronogramasParaGuardias: boolean = true
  ) {
    this.guardias = guardias;
    this.consultorios = consultorios;
    this.giras = giras;
    this.otras = otras;
    this.crearCronogramasParaGuardias = crearCronogramasParaGuardias;
  }
}
