export class FacturaDetailDto {
  id: number;
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
    constructor(
        id: number,
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
    ) {
        this.id = id;
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
    }
}
