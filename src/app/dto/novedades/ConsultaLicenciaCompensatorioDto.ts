export class ConsultaLicenciaCompensatorioDto {
    idPersona: number;
    fechaInicioConsulta: Date;
    horaInicioConsulta: Date;
    fechaFinConsulta: Date;
    horaFinConsulta: Date;


    constructor(
    idPersona: number,
    fechaInicioConsulta: Date,
    horaInicioConsulta: Date,
    fechaFinConsulta: Date,
    horaFinConsulta: Date,
    ) {
        this.idPersona = idPersona;
        this.fechaInicioConsulta = fechaInicioConsulta;
        this.horaInicioConsulta = horaInicioConsulta;
        this.fechaFinConsulta = fechaFinConsulta;
        this.horaFinConsulta = horaFinConsulta;
    }
}
