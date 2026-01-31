import { ValorGuardiaResponseDto } from './ValorGuardiaResponseDto';

export interface DetalleValoresDto {
  cargo: ValorGuardiaResponseDto | null;
  extra: ValorGuardiaResponseDto | null;
}
