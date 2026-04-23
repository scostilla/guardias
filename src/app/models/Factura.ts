import { Asistencial } from './Configuracion/Asistencial';
import { RegistroMensual } from './RegistroMensual';

export class Factura {
  id?: number;
  asistencial: Asistencial;
  registrosMensuales: RegistroMensual[];
  nombreTitular: string;
  apellidoTitular: string;
  dniTitular: number;
  cuilTitular: string;
  contribuyente: string[];
  tipo: string;
  puntoVenta: number;
  numeroFactura: number;
  fechaEmision: string;
  monto: number;
  activo: boolean;
  url: string;
  

  constructor(
    asistencial: Asistencial,
    registrosMensuales: RegistroMensual[],
    nombreTitular: string,
    apellidoTitular: string,
    dniTitular: number,
    cuilTitular: string,
    contribuyente: string[],
    tipo: string,
    puntoVenta: number,
    numeroFactura: number,
    fechaEmision: string,
    monto: number,
    activo: boolean,
    url: string
  ) {
    this.asistencial = asistencial;
    this.registrosMensuales = registrosMensuales;
    this.nombreTitular = nombreTitular;
    this.apellidoTitular = apellidoTitular;
    this.dniTitular = dniTitular;
    this.cuilTitular = cuilTitular;
    this.contribuyente = contribuyente;
    this.tipo = tipo;
    this.puntoVenta = puntoVenta;
    this.numeroFactura = numeroFactura;
    this.fechaEmision = fechaEmision;
    this.monto = monto;
    this.activo = activo;
    this.url = url;
  }
}
