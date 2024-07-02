import { Departamento } from "./Departamento";
import { Efector } from './Efector';

export class Localidad {
    id?: number;
    nombre: string;
    departamento: Departamento;
    activo: boolean;
    efectores: Efector[];


constructor(
    nombre: string,
    departamento: Departamento,
    activo: boolean,
    efectores: Efector[]
) {
    this.nombre = nombre;
    this.departamento = departamento;
    this.activo = activo;
    this.efectores = efectores;

}
}
