export class TentativoIdsResponseDto {
    idServicio: number;
    idTipoGuardia: number;

    constructor(
        idServicio: number,
        idTipoGuardia: number,
    ) {
        this.idServicio = idServicio;
        this.idTipoGuardia = idTipoGuardia;
      }
}
