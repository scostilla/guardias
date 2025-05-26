export class CronogramaTentativoResquestDto {
    idAsistencial: number;
    idEfector: number;
    tipoGuardia: string;
    fechaIngreso: Date;
    horaIngreso: Date;
    horaEgreso: Date;

    constructor(
        idAsistencial: number,
        idEfector: number,
        tipoGuardia: string,
        fechaIngreso: Date,
        horaIngreso: Date,
        horaEgreso: Date,
    ) {
        this.idAsistencial = idAsistencial;
        this.idEfector = idEfector;
        this.tipoGuardia = tipoGuardia;
        this.fechaIngreso = fechaIngreso;
        this.horaIngreso = horaIngreso;
        this.horaEgreso = horaEgreso;
      }
  
  };
  