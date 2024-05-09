export class RegistroMensualDto {
    
    mes: string;
    anio: number;
    idAsistencial: number;
    activo: boolean;
    idRegistroActividad: number[];
    idEfector: number;

    constructor (
        mes: string, 
        anio: number, 
        idAsistencial: number, 
        activo: boolean, 
        idRegistroActividad: number[], 
        idEfector: number
    ){
        this.mes = mes;
        this.anio= anio;
        this.idAsistencial = idAsistencial;
        this.activo = activo;
        this.idRegistroActividad = idRegistroActividad;
        this.idEfector = idEfector;
    }
}