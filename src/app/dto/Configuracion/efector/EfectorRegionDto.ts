export class EfectorRegionDto {
  id:number;
    nombre: string;
    idRegion: number;

    constructor(
        id: number,
        nombre: string,
        idRegion: number,
    ) {
        this.id = id;
        this.nombre = nombre;
        this.idRegion = idRegion;
    }
}