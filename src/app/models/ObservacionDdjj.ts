import { Usuario } from "./login/Usuario";
import { Ddjj } from './Configuracion/Ddjj';

export class ObservacionDdjj {
  id?: number;
  activo: boolean;
  motivo: string;
  tipoDph: boolean;
  usuario: Usuario;
  ddjj: Ddjj;
  
  

  constructor(
    activo: boolean,
    motivo: string,
    tipoDph: boolean,
    usuario: Usuario,
    ddjj: Ddjj,
  ) {
    this.activo = activo;
    this.motivo = motivo;
    this.tipoDph = tipoDph;
    this.usuario = usuario;
    this.ddjj = ddjj;
  }
}
