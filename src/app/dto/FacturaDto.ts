export class FacturaDto {
  idAsistencial: number;
  idRegistrosMensuales: number[];
  nombreTitular: string;
  apellidoTitular: string;
  dniTitular: number;
  cuilTitular: string;
  contribuyente: string;
  tipo: string;
  puntoVenta: number;
  numeroFactura: number;
  fechaEmision: string;
  monto: number;
  activo: boolean;
  url: string;

    constructor(
        idAsistencial: number,
        idRegistrosMensuales: number[],
        nombreTitular: string,
        apellidoTitular: string,
        dniTitular: number,
        cuilTitular: string,
        contribuyente: string,
        tipo: string,
        puntoVenta: number,
        numeroFactura: number,
        fechaEmision: string,
        monto: number,
        activo: boolean,
        url: string
    ) {
        this.idAsistencial = idAsistencial;
        this.idRegistrosMensuales = idRegistrosMensuales;
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
