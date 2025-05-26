export class VerificacionTentativoResponseDto {
    id: number;
    existe: boolean;

    constructor(
        id: number,
        existe: boolean

    ) {
        this.id = id;
        this.existe = existe;
    }

}