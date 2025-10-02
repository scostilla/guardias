export class RegistroMensualDto {
    
    mes: string;
    anio: number;
    idAsistencial: number;
    activo: boolean;
    idRegistroActividad: number[];
    idEfector: number;
    idDdjjs?: number[];
    idSumaHoras?: number;
    quincena?: string; // QuincenaEnum
    estadoFacturacion?: string; // EstadoFacturacionEnum

    constructor (
        mes: string, 
        anio: number, 
        idAsistencial: number, 
        activo: boolean, 
        idRegistroActividad: number[], 
        idEfector: number,
        idDdjjs?: number[],
        idSumaHoras?: number,
        quincena?: string, // QuincenaEnum
        estadoFacturacion?: string, // EstadoFacturacionEnum
    ){
        this.mes = mes;
        this.anio= anio;
        this.idAsistencial = idAsistencial;
        this.activo = activo;
        this.idRegistroActividad = idRegistroActividad;
        this.idEfector = idEfector;
        this.idDdjjs = idDdjjs;
        this.idSumaHoras = idSumaHoras;
        this.quincena = quincena;
        this.estadoFacturacion = estadoFacturacion;
    }
}