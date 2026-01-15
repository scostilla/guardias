import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { map, catchError, of } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { CambiarPassword } from 'src/app/dto/usuario/cambiar-password';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css']
})

export class CambiarPasswordComponent {

  form: FormGroup;
  hideActual = true;
  hideNueva = true;
  hideConfirmar = true;
  loading = true;
  nombreUsuario!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private dialogRef: MatDialogRef<CambiarPasswordComponent>
  ) {
this.form = this.fb.group(
  {
    passwordActual: [
      '',
      Validators.required,
      [this.passwordActualValidator()],
      { updateOn: 'blur' } // 🔥 recomendado
    ],
    nuevaPassword: [
      '',
      [Validators.required, Validators.minLength(8)]
    ],
    confirmarPassword: ['', Validators.required]
  },
  {
    validators: this.passwordsIguales
  }
);
  }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.nombreUsuario = this.tokenService.getUserName();
    } else if (this.tokenService.getProfessionalToken()) {
      this.nombreUsuario = this.tokenService.getProfessionalUserName();
    }
  }

  passwordActualValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value || !this.nombreUsuario) {
        return of(null);
      }

      return this.authService
        .validatePassword(this.nombreUsuario, control.value)
        .pipe(
          map(isValid => (isValid ? null : { incorrecta: true })),
          catchError(() => of({ incorrecta: true }))
        );
    };
  }

  passwordsIguales(form: FormGroup) {
    const nuevaCtrl = form.get('nuevaPassword');
    const confirmarCtrl = form.get('confirmarPassword');

    if (!nuevaCtrl || !confirmarCtrl) return null;

    const nueva = nuevaCtrl.value;
    const confirmar = confirmarCtrl.value;

    // Si está vacío, dejamos que required actúe
    if (!confirmar) {
      if (confirmarCtrl.errors?.['passwordsNoCoinciden']) {
        const errors = { ...confirmarCtrl.errors };
        delete errors['passwordsNoCoinciden'];
        confirmarCtrl.setErrors(
          Object.keys(errors).length ? errors : null
        );
      }
      return null;
    }

    if (nueva !== confirmar) {
      confirmarCtrl.setErrors({
        ...confirmarCtrl.errors,
        passwordsNoCoinciden: true
      });
      return { passwordsNoCoinciden: true };
    }

    // Si coinciden, quitar solo este error
    if (confirmarCtrl.errors?.['passwordsNoCoinciden']) {
      const errors = { ...confirmarCtrl.errors };
      delete errors['passwordsNoCoinciden'];
      confirmarCtrl.setErrors(
        Object.keys(errors).length ? errors : null
      );
    }

    return null;
  }

cancelar(): void {
  this.tokenService.logOut();
  this.dialogRef.close(false);
  this.router.navigate(['/login']);
}

guardar(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const dto = new CambiarPassword(
    this.form.value.passwordActual,
    this.form.value.nuevaPassword,
    this.form.value.confirmarPassword
  );

  this.loading = true;

  this.authService.cambiarPassword(dto).subscribe({
    next: () => {
      this.loading = false;
      this.dialogRef.close(true);

      // cerrar sesión
      this.tokenService.logOut();

      // redirigir al login
      this.router.navigate(['/login']);
          },
    error: err => {
      console.error('Error cambiar password:', err);
      this.loading = false;
    }
  });
}
}