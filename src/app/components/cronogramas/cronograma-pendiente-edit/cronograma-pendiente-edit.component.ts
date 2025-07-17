import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CronogramaTentativoListAtorizadoDto } from 'src/app/dto/Cronogramas/CronogramaTentativoListAtorizadoDto';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { TokenService } from 'src/app/services/login/token.service';
import { AutorizadoUpdateDto } from 'src/app/dto/Cronogramas/AutorizadoUpdateDto';

@Component({
  selector: 'app-cronograma-pendiente-edit',
  templateUrl: './cronograma-pendiente-edit.component.html',
  styleUrls: ['./cronograma-pendiente-edit.component.css']
})
export class CronogramaPendienteEditComponent implements OnInit {

  form!: FormGroup;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CronogramaPendienteEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CronogramaTentativoListAtorizadoDto,
    private cronogramaTentativoService: CronogramaTentativoService,
    private tokenService: TokenService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Obtener ID de autoridad desde el token
    const userIdFromToken = this.tokenService.getUserIdFromToken();
    this.userId = userIdFromToken !== null ? Number(userIdFromToken) : null;

    this.form = this.fb.group({
      autorizado: [null, Validators.required],
      motivoAutorizacion: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.userId === null) return;

    this.cronogramaTentativoService.getIdAutoridadByIdUsuario(this.userId).subscribe({
      next: (idAutoridad) => {
        const dto = new AutorizadoUpdateDto(
          this.form.value.autorizado,
          this.form.value.motivoAutorizacion,
          idAutoridad
        );

        console.log('📤 DTO enviado al backend:', {
          autorizado: dto.autorizado,
          motivoAutorizacion: dto.motivoAutorizacion,
          idAutoridad: dto.idAutoridad
        });

        this.cronogramaTentativoService.autorizarUpdate(this.data.id, dto).subscribe({
          next: () => {
            this.toastr.success('Estado actualizado correctamente');
            this.dialogRef.close(true);
          },
          error: () => {
            this.toastr.error('Error al actualizar estado');
          }
        });
      },
      error: () => {
        this.toastr.error('No se pudo obtener el ID de autoridad para el usuario');
      }
    });
  }

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.dialogRef.close({ type: 'cancel' });
  }


}
