import { Legajo } from "./Legajo";
import { NovedadPersonal } from "../guardias/NovedadPersonal";
import { DistribucionHoraria } from "./DistribucionHoraria";
import { Autoridad } from "./Autoridad";
import { RegistroMensual } from "../RegistroMensual";
import { Usuario } from "../login/Usuario";

export class Person {
  id?: number;
  nombre: string;
  apellido: string;
  dni: number;
  cuil: string;
  fechaNacimiento: Date;
  sexo: string;
  telefono: string;
  email: string;
  domicilio: string;
  esAsistencial: boolean;
  activo: boolean;
  legajos: Legajo[];
  novedadesPersonales: NovedadPersonal[];
  suplentes: NovedadPersonal[];
  distribucionesHorarias: DistribucionHoraria[];
  autoridades: Autoridad[];
  registrosMensuales: RegistroMensual[];
  usuario: Usuario;

  constructor(
    nombre: string,
    apellido: string,
    dni: number,
    cuil: string,
    fechaNacimiento: Date,
    sexo: string,
    telefono: string,
    email: string,
    domicilio: string,
    esAsistencial: boolean,
    activo: boolean,
    legajos: Legajo[],
    novedadesPersonales: NovedadPersonal[],
    suplentes: NovedadPersonal[],
    distribucionesHorarias: DistribucionHoraria[],
    autoridades: Autoridad[],
    registrosMensuales: RegistroMensual[],
    usuario: Usuario

  ) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.cuil = cuil;
    this.fechaNacimiento = fechaNacimiento;
    this.sexo = sexo;
    this.telefono = telefono;
    this.email = email;
    this.domicilio = domicilio;
    this.esAsistencial = esAsistencial;
    this.activo = activo;
    this.legajos = legajos;
    this.novedadesPersonales = novedadesPersonales;
    this.suplentes = suplentes;
    this.distribucionesHorarias = distribucionesHorarias;
    this.autoridades = autoridades;
    this.registrosMensuales = registrosMensuales;
    this.usuario = usuario;
  }

}