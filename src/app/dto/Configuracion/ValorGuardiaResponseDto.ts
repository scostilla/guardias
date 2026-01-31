import { MontoDto } from './MontoDto';

export interface ValorGuardiaResponseDto {
  decreto1178: MontoDto | null;
  decreto1657: MontoDto | null;
  resolucion2575: MontoDto | null;
  bono1580: MontoDto | null;
  total: MontoDto | null;
}
