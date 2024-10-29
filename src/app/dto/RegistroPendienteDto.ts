export class RegistroPendienteDto {
    
    fecha: string; 
    activo: boolean;
    idEfector: number; 
    idRegistrosActividades: number[]; 

        constructor (
            fecha: string,
            activo: boolean,
            idEfector: number,
            idRegistrosActividades: number[],
                ){
            this.fecha = fecha;
            this.activo = activo;
            this.idEfector = idEfector;
            this.idRegistrosActividades = idRegistrosActividades;
        }
    }
