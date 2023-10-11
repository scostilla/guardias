import { DateTime } from "luxon";

export class RegistroActividad{
    id?: number;
    establecimiento: string;
    fechaIngreso: Date;
    fechaEgreso: Date;
    horaIngreso: String;
    horaEgreso: String;
    servicio:string
    
    constructor(establecimiento:string, fechaIngreso:Date, fechaEgreso: Date, horaIngreso: String, horaEgreso: String, servicio:string){
        this.establecimiento=establecimiento;
        this.fechaIngreso=fechaIngreso;
        this.fechaEgreso=fechaEgreso;
        this.horaIngreso=horaIngreso;
        this.horaEgreso=horaEgreso;
        this.servicio=servicio
    }
}