import { Legajo } from './Legajo';
import { RegistroActividad } from '../RegistroActividad';

export class TipoGuardia{
    id?: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
    legajos: Legajo[];
    registrosActividades: RegistroActividad[]; 

    constructor (
        nombre: string,
        descripcion: string,
        activo: boolean,
        legajos: Legajo[],
        registrosActividades: RegistroActividad[],     
    ){
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.activo = activo;
        this.legajos = legajos;
        this.registrosActividades = registrosActividades;
    }
}