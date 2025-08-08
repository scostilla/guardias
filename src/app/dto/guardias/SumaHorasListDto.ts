export class SumaHorasListDto {
    id: number;
    horasLav: number;
    horasSdf: number;
    montoLav: number;
    montoSdf: number;
    montoTotal: number;

    constructor (
        id: number,
        horasLav: number,
        horasSdf: number,
        montoLav: number,
        montoSdf: number,
        montoTotal: number
        ){
        this.id = id;
        this.horasLav = horasLav;
        this.horasSdf = horasSdf;
        this.montoLav = montoLav;
        this.montoSdf = montoSdf;
        this.montoTotal = montoTotal;
    }
}