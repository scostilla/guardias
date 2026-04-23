export class ResetPassword {
  nombreUsuario: string;
  nuevaPassword: string;

  constructor(nombreUsuario: string, nuevaPassword: string) {
    this.nombreUsuario = nombreUsuario;
    this.nuevaPassword = nuevaPassword;
  }
}