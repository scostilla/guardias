import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NovedadPersonalDto } from 'src/app/dto/personal/NovedadPersonalDto';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialSelectorComponent } from 'src/app/components/configuracion/usuarios/asistencial-selector/asistencial-selector.component';
import { TipoLicencia } from 'src/app/models/Configuracion/TipoLicencia';
import { TipoLicenciaService } from 'src/app/services/Configuracion/tipoLicencia.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-novedades-person-edit',
  templateUrl: './novedades-person-edit.component.html',
  styleUrls: ['./novedades-person-edit.component.css']
})
export class NovedadesPersonEditComponent implements OnInit {
  novedadPersonalForm!: FormGroup;
  initialData: any;
  asistenciales: Asistencial[] = [];
  licencias: TipoLicencia[] = [];
  inputValue: string = '';
  selectedAsistencial?: Asistencial;

  
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NovedadesPersonEditComponent>,
    private novedadPersonalService: NovedadPersonalService,
    private tipoLicenciaService: TipoLicenciaService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { asistencialId: number; novedadPersonal?: NovedadPersonalDto }
  ) {
    this.novedadPersonalForm = this.fb.group({
      idTipoLicencia: ['', [Validators.required]],
      fechaInicio: ['', Validators.required],
      fechaFinal: [{ value: '', disabled: true }, Validators.required], 
      idSuplente: ['', Validators.required],
      puedeRealizarGuardia: [''],
      cobraSueldo: [''],
      necesitaReemplazo: [''],
    }, { validators: this.dateLessThan('fechaInicio', 'fechaFinal') });

    this.listLicencia();

    if (data) {
      this.novedadPersonalForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    if (this.data.novedadPersonal) {
      this.novedadPersonalForm.patchValue({
        idTipoLicencia: this.data.novedadPersonal.idTipoLicencia,
        fechaInicio: this.data.novedadPersonal.fechaInicio,
        fechaFinal: this.data.novedadPersonal.fechaFinal,
        idSuplente: this.data.novedadPersonal.idSuplente,
        puedeRealizarGuardia: this.data.novedadPersonal.puedeRealizarGuardia,
        cobraSueldo: this.data.novedadPersonal.cobraSueldo,
        necesitaReemplazo: this.data.novedadPersonal.necesitaReemplazo,
      });
    }
    this.initialData = this.novedadPersonalForm.value;

    // Observa los cambios en fechaInicio para habilitar o deshabilitar fechaFinal
    this.novedadPersonalForm.get('fechaInicio')?.valueChanges.subscribe(value => {
      if (value) {
        this.novedadPersonalForm.get('fechaFinal')?.enable();
      } else {
        this.novedadPersonalForm.get('fechaFinal')?.disable();
      }
    });
  }

  // Validador personalizado para comprobar que la fechaFinal no sea anterior a fechaInicio
  dateLessThan(start: string, end: string) {
    return (formGroup: AbstractControl) => {
      const startControl = formGroup.get(start);
      const endControl = formGroup.get(end);
      if (startControl && endControl) {
        if (endControl.value && startControl.value && endControl.value < startControl.value) {
          endControl.setErrors({ dateLessThan: true });
        } else {
          endControl.setErrors(null);
        }
      }
    };
  }
  
  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.novedadPersonalForm.value);
  }

  listLicencia(): void {
    this.tipoLicenciaService.list().subscribe(data => {
      this.licencias = data;
    }, error => {
      console.log(error);
    });
  }

  openAsistencialDialog(): void {
    const dialogRef = this.dialog.open(AsistencialSelectorComponent, {
      width: '800px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedAsistencial = result;
        this.inputValue = `${result.apellido} ${result.nombre}`;
        this.novedadPersonalForm.patchValue({ idSuplente: result.id });
      } else {
        this.toastr.info('No se seleccionó un profesional', 'Información', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }, error => {
      this.toastr.error('Ocurrió un error al abrir el diálogo de Asistencial', 'Error', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      console.error('Error al abrir el diálogo de carga de profesional:', error);
    });
  }
  


  saveNovedadPersonal(): void {
    if (this.novedadPersonalForm.valid) {
      console.log('Valores del formulario:', this.novedadPersonalForm.value);
      const formValue = this.novedadPersonalForm.value;
  
      const novedadPersonalDto = new NovedadPersonalDto(
        formValue.fechaInicio,
        formValue.fechaFinal,
        formValue.puedeRealizarGuardia,
        formValue.cobraSueldo,
        formValue.necesitaReemplazo,
        true,
        formValue.idTipoLicencia,
        this.data.novedadPersonal ? this.data.novedadPersonal.idPersona : this.data.asistencialId,
        formValue.idSuplente,
      );
      console.log('Datos a guardar:', novedadPersonalDto);

      if (this.data.novedadPersonal && this.data.novedadPersonal.id) {
        this.novedadPersonalService.update(this.data.novedadPersonal.id, novedadPersonalDto).subscribe(
          result => {
            console.log('Novedad actualizada:', result);
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            console.error('Error al actualizar la novedad:', error);
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        this.novedadPersonalService.save(novedadPersonalDto).subscribe(
          result => {
            console.log('Novedad creada:', result);
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            console.error('Error al crear la novedad:', error);
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      }
    }
  }

  compareLicencia(p1: TipoLicencia, p2: TipoLicencia): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancel(): void {
    this.dialogRef.close();
  }
}