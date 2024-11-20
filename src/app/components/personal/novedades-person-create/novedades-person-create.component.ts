import { Component, Inject, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AsistencialSelectorComponent } from "src/app/components/configuracion/usuarios/asistencial-selector/asistencial-selector.component";
import { NovedadPersonalDto } from "src/app/dto/personal/NovedadPersonalDto";
import { Asistencial } from "src/app/models/Configuracion/Asistencial";
import { TipoLicencia } from "src/app/models/Configuracion/TipoLicencia";
import { NovedadPersonal } from "src/app/models/personal/NovedadPersonal";
import { TipoLicenciaService } from "src/app/services/Configuracion/tipoLicencia.service";
import { NovedadPersonalService } from "src/app/services/personal/novedadPersonal.service";

@Component({
    selector: 'app-novedades-person-create',
    templateUrl: './novedades-person-create.component.html',
    styleUrls: ['./novedades-person-create.component.css']
    })
export class NovedadesPersonCreateComponent implements OnInit {
    novedadPersonalForm!: FormGroup;
    initialData: any;
    asistenciales: Asistencial[] = [];
    licencias: TipoLicencia[] = [];
    inputValue: string = '';
    selectedAsistencial?: Asistencial;
  
    constructor(
        private fb: FormBuilder,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<NovedadesPersonCreateComponent>,
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
      }
      
      ngOnInit(): void {
        this.novedadPersonalForm.get('fechaInicio')?.valueChanges.subscribe(value => {
          if (value) {
            this.novedadPersonalForm.get('fechaFinal')?.enable();
          } else {
            this.novedadPersonalForm.get('fechaFinal')?.disable();
          }
        });
      
        this.novedadPersonalForm.get('necesitaReemplazo')?.valueChanges.subscribe(value => {
          this.toggleSuplenteValidation(value);
          this.toggleSuplenteDisabled(value);
        });
      
        this.toggleSuplenteValidation(this.novedadPersonalForm.get('necesitaReemplazo')?.value);
        this.toggleSuplenteDisabled(this.novedadPersonalForm.get('necesitaReemplazo')?.value);
      }

toggleSuplenteValidation(necesitaReemplazo: boolean): void {
  const idSuplenteControl = this.novedadPersonalForm.get('idSuplente');
  
  if (necesitaReemplazo) {
    idSuplenteControl?.setValidators([Validators.required]);
  } else {
    idSuplenteControl?.clearValidators();
  }

  // Actualiza la validez del campo tras modificar sus validadores
  idSuplenteControl?.updateValueAndValidity();
}

// Método para habilitar o deshabilitar el campo idSuplente
toggleSuplenteDisabled(necesitaReemplazo: boolean): void {
  const idSuplenteControl = this.novedadPersonalForm.get('idSuplente');
  
  if (necesitaReemplazo) {
    idSuplenteControl?.enable();
  } else {
    idSuplenteControl?.disable();
  }
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
  
    listLicencia(): void {
        this.tipoLicenciaService.list().subscribe(data => {
        this.licencias = data;
        }, error => {
            console.error('Error al cargar las licencias', error);
    });
}

openFormcreate(novedadPersonal?: NovedadPersonal): void {
    const dialogData = {
        asistencialId: this.data.asistencialId,
        novedadPersonal: novedadPersonal
        };
        const dialogRef = this.dialog.open(NovedadesPersonCreateComponent, {
            width: '600px',
            data: dialogData
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

      const novedadPersonal = this.novedadPersonalForm.value;

      const novedadPersonalDto = new NovedadPersonalDto(
        novedadPersonal.fechaInicio,
        novedadPersonal.fechaFinal,
        novedadPersonal.puedeRealizarGuardia,
        novedadPersonal.cobraSueldo,
        novedadPersonal.necesitaReemplazo,
        true,
        this.data.novedadPersonal ? this.data.novedadPersonal.idPersona : this.data.asistencialId,
        novedadPersonal.idSuplente ?? null,
        novedadPersonal.idTipoLicencia,
      );
      console.log('Datos a guardar:', novedadPersonalDto);
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
cancel(): void {
    this.dialogRef.close();
  }
}