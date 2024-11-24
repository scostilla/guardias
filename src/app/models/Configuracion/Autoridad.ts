import { Person } from "./Person";

export class Autoridad {
    id?: number;
    activo: boolean;
    persona: Person | null;

    constructor(
        activo: boolean,
        persona: Person | null,
    ) {
        this.activo = activo;
        this.persona = persona;
    }
}