export class AsistencialTiposGuardiasDto {

    idTipoGuardia:number;
    nombreTipoGuardia: string;

    constructor(
        idTipoGuardia: number,
        nombreTipoGuardia: string,
    ) {
        this.idTipoGuardia = idTipoGuardia;
        this.nombreTipoGuardia = nombreTipoGuardia;
    }

}