export class AutorizadoUpdateDto {
    autorizado: string;
    motivoAutorizacion: string;
    idAutoridad: number;


    constructor(
        autorizado: string,
        motivoAutorizacion: string,
        idAutoridad: number,
    ) {
        this.autorizado = autorizado;
        this.motivoAutorizacion = motivoAutorizacion;
        this.idAutoridad = idAutoridad;
      }
}
