export class DistribucionCheckDto {
    idPersona: number;
    idEfector: number;
    fecha: string;
    constructor(
        idPersona: number,
        idEfector: number,
        fecha: string,
          ) {
        this.idPersona = idPersona;
        this.idEfector = idEfector;
        this.fecha = fecha;
      }
      
}
