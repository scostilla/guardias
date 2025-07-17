export class TentativoSearchRequestDto {
    idAsistencial: number;
    idEfector: number;
    fechaIngreso: Date;
    horaIngreso: Date;

    constructor(
        idAsistencial: number,
        idEfector: number,
        fechaIngreso: Date,
        horaIngreso: Date,

    ) {
        this.idAsistencial = idAsistencial;
        this.idEfector = idEfector;
        this.fechaIngreso = fechaIngreso;
        this.horaIngreso = horaIngreso;
      }
}
