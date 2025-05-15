export class DistribucionCheckDto {
    idPersona: number;
    fecha: string;
    constructor(
        idPersona: number,
        fecha: string,
          ) {
        this.idPersona = idPersona;
        this.fecha = fecha;
      }
      
}
