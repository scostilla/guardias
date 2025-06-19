import { Person } from "./Person";

export class Autoridad {
    id?: number;
    activo: boolean;
    confirmado: boolean | null;
    persona: Person | null;
    motivo: string | null;

    constructor(
        activo: boolean,
        confirmado: boolean | null,
        persona: Person | null,
        motivo: string | null
    ) {
        this.activo = activo;
        this.confirmado = confirmado;
        this.persona = persona;
        this.motivo = motivo;
    }
}