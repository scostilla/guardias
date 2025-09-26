export class CronogramaDefinitivoDto {
    mes: string;
    anio: number;
    activo: boolean;
    idEfector: number;
    idDdjjs: number[];
    quincena?: string;

    constructor(
        mes: string,
        anio: number,
        activo: boolean,
        idEfector: number,
        idDdjjs: number[],
        quincena?: string,
    ) {
        this.mes = mes;
        this.anio = anio;
        this.activo = activo;
        this.idEfector = idEfector;
        this.idDdjjs = idDdjjs;
        this.quincena = quincena;
    }
}