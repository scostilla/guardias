import { Efector } from "./Efector";
import { Localidad } from "./Localidad";
import { Region } from "./Region";


export class Ministerio extends Efector {
    
    idCabecera: number;
    idAutoridad: number;


    constructor(nombre:string,domicilio: string,telefono: string, estado: boolean, observacion: string, region: Region,localidad: Localidad,  idCabecera: number, idAutoridad: number) {
        super(nombre,domicilio,telefono,estado,observacion,region,localidad);
        this.idCabecera = idCabecera;
        this.idAutoridad = idAutoridad;
    }

}