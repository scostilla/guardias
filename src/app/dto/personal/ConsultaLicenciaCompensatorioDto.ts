export class ConsultaLicenciaCompensatorioDto {
    idPersona: number;
    fechaInicioConsulta: string;
    horaInicioConsulta: string;
    fechaFinConsulta: string;
    horaFinConsulta: string;

    constructor(
        idPersona: number,
        fechaInicioConsulta: string,
        horaInicioConsulta: string,
        fechaFinConsulta: string,
        horaFinConsulta: string,
            ){
        this.idPersona = idPersona;
        this.fechaInicioConsulta = fechaInicioConsulta;
        this.horaInicioConsulta = horaInicioConsulta;
        this.fechaFinConsulta = fechaFinConsulta;
        this.horaFinConsulta = horaFinConsulta;
    }
}
