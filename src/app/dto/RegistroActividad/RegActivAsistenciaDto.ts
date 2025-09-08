import { AsistencialDetailDto } from "../Configuracion/asistencial/AsistencialDetailDto";

export class RegActivAsistenciaDto {
  id: number;
  fechaIngreso: Date;
  fechaEgreso: Date;
  fechaRegistroIngreso: Date;
  fechaRegistroEgreso: Date;
  horaIngreso: string;
  horaEgreso: string;
  horaRegistroIngreso: string;
  horaRegistroEgreso: string;
  tipoGuardia: string;
  activo: boolean;
  asistencialDetailDto: AsistencialDetailDto[];
  servicio: string;
  idEfector: number;
  usuarioIngreso: string;
  idUsuarioIngreso: number;
  motivoIngreso: string;
  motivoEgreso: string;

  constructor(
    id: number,
    fechaIngreso: Date,
    fechaEgreso: Date,
    fechaRegistroIngreso: Date,
    fechaRegistroEgreso: Date,
    horaIngreso: string,
    horaEgreso: string,
    horaRegistroIngreso: string,
    horaRegistroEgreso: string,
    tipoGuardia: string,
    activo: boolean,
    asistencialDetailDto: AsistencialDetailDto[],
    servicio: string,
    idEfector: number,
    usuarioIngreso: string,
    idUsuarioIngreso: number,
    motivoIngreso: string,
    motivoEgreso: string
  ) {
    this.id = id;
    this.fechaIngreso = fechaIngreso;
    this.fechaEgreso = fechaEgreso;
    this.fechaRegistroIngreso = fechaRegistroIngreso;
    this.fechaRegistroEgreso = fechaRegistroEgreso;
    this.horaIngreso = horaIngreso;
    this.horaEgreso = horaEgreso;
    this.horaRegistroIngreso = horaRegistroIngreso;
    this.horaRegistroEgreso = horaRegistroEgreso;
    this.tipoGuardia = tipoGuardia;
    this.activo = activo;
    this.asistencialDetailDto = asistencialDetailDto;
    this.servicio = servicio;
    this.idEfector = idEfector;
    this.usuarioIngreso = usuarioIngreso;
    this.idUsuarioIngreso = idUsuarioIngreso;
    this.motivoIngreso = motivoIngreso;
    this.motivoEgreso = motivoEgreso;
  }
}
