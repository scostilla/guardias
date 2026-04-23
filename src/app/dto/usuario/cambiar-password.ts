export class CambiarPassword {

  nombreUsuario: string;
  passwordActual: string;
  nuevaPassword: string;
  confirmarPassword: string;

  constructor(
    nombreUsuario: string,
    passwordActual: string,
    nuevaPassword: string,
    confirmarPassword: string
  ) {
    this.nombreUsuario = nombreUsuario;
    this.passwordActual = passwordActual;
    this.nuevaPassword = nuevaPassword;
    this.confirmarPassword = confirmarPassword;
  }
}
