export class CambiarPassword {

  passwordActual: string;
  nuevaPassword: string;
  confirmarPassword: string;

  constructor(
    passwordActual: string,
    nuevaPassword: string,
    confirmarPassword: string
  ) {
    this.passwordActual = passwordActual;
    this.nuevaPassword = nuevaPassword;
    this.confirmarPassword = confirmarPassword;
  }
}
