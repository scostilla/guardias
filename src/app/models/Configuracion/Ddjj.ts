import { RegistroMensual } from "../RegistroMensual";
import { Efector } from "./Efector";
import { ValorGmi } from "./ValorGmi";

export class Ddjj {
    id?: number;
    activo: boolean;
    mes: string;
    anio: number;
    subtotal: number;
    total: number;
    estadoDdjj: string;
    valorGmi: ValorGmi;
    efector: Efector;
    registrosMensuales: RegistroMensual[];

    constructor(
        activo: boolean,
        mes: string,
        anio: number,
        subtotal: number,
        total: number,
        estadoDdjj: string,
        valorGmi: ValorGmi,
        efector: Efector,
        registrosMensuales: RegistroMensual[]
    ) {
        this.activo = activo;
        this.mes = mes;
        this.anio = anio;
        this.subtotal = subtotal;
        this.total = total;
        this. estadoDdjj = estadoDdjj;
        this.valorGmi = valorGmi;
        this.efector = efector;
        this.registrosMensuales = registrosMensuales;
    }
}