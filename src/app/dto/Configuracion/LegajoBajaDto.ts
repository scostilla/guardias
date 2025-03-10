export class LegajoBajaDto {
    fechaFinal: Date;
    motivoBaja: string;
      
    constructor(fechaFinal: Date, motivoBaja: string) {
        this.fechaFinal = fechaFinal;
        this.motivoBaja = motivoBaja;
    }
}
    
