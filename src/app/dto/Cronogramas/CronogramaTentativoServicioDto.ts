export class CronogramaTentativoServicioDto {
    idServicio: number;
    nombreServicio: string;

    constructor(
        idServicio: number,
        nombreServicio: string,
    ) {
        this.idServicio = idServicio;
        this.nombreServicio = nombreServicio;
      }
}
