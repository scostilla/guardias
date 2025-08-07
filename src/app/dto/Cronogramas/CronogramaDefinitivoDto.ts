export class CronogramaDefinitivoDto {
    mes: string;
    anio: number;
    activo: boolean;
    idEfector: number;
    idDdjjs: number[];

    constructor(
        mes: string,
        anio: number,
        activo: boolean,
        idEfector: number,
        idDdjjs: number[],
    ) {
        this.mes = mes;
        this.anio = anio;
        this.activo = activo;
        this.idEfector = idEfector;
        this.idDdjjs = idDdjjs;
    }
}