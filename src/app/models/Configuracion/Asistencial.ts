import { RegistroActividad } from "../RegistroActividad";
import { RegistroMensual } from "../RegistroMensual";
import { NovedadPersonal } from "../guardias/NovedadPersonal";
import { Usuario } from "../login/Usuario";
import { Autoridad } from "./Autoridad";
import { DistribucionHoraria } from "./DistribucionHoraria";
import { Legajo } from "./Legajo";
import { Person } from "./Person";
import { TipoGuardia } from "./TipoGuardia";

export class Asistencial extends Person {

  tiposGuardias: TipoGuardia[];
  registrosActividades: RegistroActividad[];

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
    usuario: Usuario,
    tiposGuardias: TipoGuardia[],
    registrosActividades: RegistroActividad[]
  ) {
    super(nombre, apellido, dni, cuil, fechaNacimiento, sexo, telefono, email, domicilio, esAsistencial, activo, legajos, novedadesPersonales, suplentes, distribucionesHorarias, autoridades, registrosMensuales, usuario);
    this.tiposGuardias = tiposGuardias;
    this.registrosActividades = registrosActividades
  }

}
