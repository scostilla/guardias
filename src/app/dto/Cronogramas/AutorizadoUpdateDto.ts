export class AutorizadoUpdateDto {
    autorizado: string;
    motivoAutorizacion?: string | null;
    idAutoridad?: number | null;


    constructor(
        autorizado: string,
        motivoAutorizacion?: string | null,
        idAutoridad?: number | null,
    ) {
        this.autorizado = autorizado;
        this.motivoAutorizacion = motivoAutorizacion;
        this.idAutoridad = idAutoridad;
      }
}
