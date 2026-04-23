import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { map, catchError, of } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CambiarPassword } from 'src/app/dto/usuario/cambiar-password';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';

export interface CambiarPasswordDialogData {
  modo: 'GENERAL' | 'PROFESIONAL';
  redirectTo: string;
}
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
  private dialogRef: MatDialogRef<CambiarPasswordComponent>,
  @Inject(MAT_DIALOG_DATA) public data: CambiarPasswordDialogData
) {
  this.form = this.fb.group(
    {
      passwordActual: [
        '',
        {
          validators: [Validators.required],
          asyncValidators: [this.passwordActualValidator()],
          updateOn: 'blur'
        }
      ],
      nuevaPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', Validators.required]
    },
    { validators: this.passwordsIguales }
  );
}

  ngOnInit(): void {
    if (this.data.modo === 'GENERAL') {
      this.nombreUsuario = this.tokenService.getUserName();
    } else {
      this.nombreUsuario = this.tokenService.getProfessionalUserName();
    }
  }

  passwordActualValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      // Si no hay valor o nombre de usuario no hace la validación
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
  this.dialogRef.close(false);
}

guardar(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const dto = new CambiarPassword(
    this.nombreUsuario,
    this.form.value.passwordActual,
    this.form.value.nuevaPassword,
    this.form.value.confirmarPassword
  );

  this.authService.cambiarPassword(dto).subscribe({
    next: () => this.dialogRef.close(true),
    error: () => this.form.setErrors({ errorServidor: true })
  });
}
}