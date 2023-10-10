import { DateTime } from "luxon";

export class RegistroActividad{
    id?: number;
    establecimiento: string;
    fechaIngreso: Date;
    fechaEgreso: Date;
    horaIngreso: Date;
    horaEgreso: Date;
    
    constructor(establecimiento:string, fechaIngreso:Date, fechaEgreso: Date, horaIngreso: Date, horaEgreso: Date){
        this.establecimiento=establecimiento;
        this.fechaIngreso=fechaIngreso;
        this.fechaEgreso=fechaEgreso;
        this.horaIngreso=horaIngreso;
        this.horaEgreso=horaEgreso;
    }
}