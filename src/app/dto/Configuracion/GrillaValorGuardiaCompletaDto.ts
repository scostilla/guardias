import { ColumnaGrillaDto } from './ColumnaGrillaDto';

export interface GrillaValorGuardiaCompletaDto {
  nombreNivel: string;
  numeroNivel: number;
  columnas: ColumnaGrillaDto[];
}
