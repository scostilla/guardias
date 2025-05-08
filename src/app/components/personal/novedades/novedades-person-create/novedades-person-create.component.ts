import { Component, Inject, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AsistencialSelectorComponent } from "src/app/components/personal/personal-contenido/asistencial-selector/asistencial-selector.component";
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
    fechaMinFinal: Date | null = null;
    idLicencia?: number;
  
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
          horaInicio: [''],
          fechaFinal: [{ value: '', disabled: true }, Validators.required],
          horaFinal: [''],
          idSuplente: [{ value: '', disabled: true }],
          puedeRealizarGuardia: [''],
          cobraSueldo: [''],
          necesitaReemplazo: [{ value: '', disabled: true }],
        });

        this.novedadPersonalForm.get('necesitaReemplazo')?.enable();
        this.novedadPersonalForm.get('idSuplente')?.disable();
        this.novedadPersonalForm.get('fechaFinal')?.updateValueAndValidity();
      
        this.listLicencia();
      }
      
      ngOnInit(): void {
        this.novedadPersonalForm.get('fechaInicio')?.valueChanges.subscribe(value => {
          this.onFechaInicioChange();
        });

        this.novedadPersonalForm.get('fechaFinal')?.valueChanges.subscribe(value => {
        });

        this.novedadPersonalForm.get('idTipoLicencia')?.valueChanges.subscribe(value => {
          console.log('Valor recibido en idTipoLicencia:', value);
          this.updateFormFields(value);
        });
    
        this.novedadPersonalForm.get('necesitaReemplazo')?.valueChanges.subscribe(value => {
          console.log(`El valor de "necesitaReemplazo" cambió a: ${value}`);
          this.toggleSuplenteValidation(value);
          this.toggleSuplenteDisabled(value);
        });
      
        // Configuración inicial
        const necesitaReemplazo = this.novedadPersonalForm.get('necesitaReemplazo')?.value || false;
        this.toggleSuplenteValidation(necesitaReemplazo);
        this.toggleSuplenteDisabled(necesitaReemplazo);
        
        // Iniciar con el campo necesitaReemplazo oculto
        this.showNecesitaReemplazo(false);

        // Llamo al servicio para obtener los tipos de licencia
        this.tipoLicenciaService.list().subscribe((licencia: TipoLicencia[]) => {
          this.licencias = licencia;
      
          // Verifico si 'Compensatorio' están en la lista
          this.idLicencia = this.licencias.find(t => t.nombre === 'Compensatorio')?.id;
      
        });
    
      }

      updateFormFields(tipoLicenciaIdOrNombre: string | number | null): void {
        // Si el valor es nulo, no se hace nada
        if (!tipoLicenciaIdOrNombre) {
          console.warn('El valor recibido en updateFormFields es nulo.');
          return;
        }
      
        // Buscar el tipo de licencia por ID o nombre
        const licencia = typeof tipoLicenciaIdOrNombre === 'string'
          ? this.licencias.find((l) => l.nombre.toLowerCase() === tipoLicenciaIdOrNombre.toLowerCase())
          : this.licencias.find((l) => l.id === tipoLicenciaIdOrNombre);
      
        if (!licencia) {
          console.warn('No se encontró un tipo de licencia con el valor proporcionado:', tipoLicenciaIdOrNombre);
          return;
        }
      
        const nombre = licencia.nombre.toLowerCase();
      
        // Define las condiciones basadas en el nombre
        const cobraSueldo = ['licencia anual ordinaria', 'licencia por maternidad'].includes(nombre);
        const puedeRealizarGuardia = ['licencia anual ordinaria', 'compensatorio'].includes(nombre);
        const necesitaReemplazo = [
          'licencia anual ordinaria',
          'licencia por maternidad',
          'largo tratamiento de salud',
        ].includes(nombre);
      
        // Actualiza los valores en el formulario
        this.novedadPersonalForm.patchValue({
          cobraSueldo,
          puedeRealizarGuardia,
          necesitaReemplazo: necesitaReemplazo ? '' : '',  // Mantener vacío en lugar de false
        });
      
        // Manejo del campo "necesitaReemplazo" y "idSuplente"
        if (necesitaReemplazo) {
          this.novedadPersonalForm.get('necesitaReemplazo')?.enable();
          this.novedadPersonalForm.get('necesitaReemplazo')?.setValidators([Validators.required]); // Habilitar validación
        } else {
          this.novedadPersonalForm.get('necesitaReemplazo')?.disable();
          this.novedadPersonalForm.get('necesitaReemplazo')?.setValue(''); // Establecer vacío
          this.novedadPersonalForm.get('necesitaReemplazo')?.clearValidators(); // Limpiar validación
        }
      
        // Ocultar o mostrar el campo "necesitaReemplazo"
        if (necesitaReemplazo) {
          // Mostrar el campo si la licencia lo requiere
          this.showNecesitaReemplazo(true);
        } else {
          // Ocultar el campo si no lo requiere
          this.showNecesitaReemplazo(false);
        }
      
        // Re-validar el campo idSuplente
        this.toggleSuplenteValidation(this.novedadPersonalForm.get('necesitaReemplazo')?.value);
        this.toggleSuplenteDisabled(this.novedadPersonalForm.get('necesitaReemplazo')?.value);
      }
      
      showNecesitaReemplazo(shouldShow: boolean): void {
        const necesitaReemplazoControl = this.novedadPersonalForm.get('necesitaReemplazo');
        if (shouldShow) {
          // Si debe mostrarse, habilitar el campo
          necesitaReemplazoControl?.enable();
        } else {
          // Si no debe mostrarse, deshabilitar el campo y establecer el valor vacío
          necesitaReemplazoControl?.disable();
          necesitaReemplazoControl?.setValue(null);
        }
      }

      get esCompensatorio(): boolean {
        const tipoLicencia = this.novedadPersonalForm.get('idTipoLicencia')?.value;
        return tipoLicencia === this.idLicencia;
      }    

toggleSuplenteValidation(necesitaReemplazo: boolean): void {
  const idSuplenteControl = this.novedadPersonalForm.get('idSuplente');
  if (necesitaReemplazo) {
    idSuplenteControl?.setValidators([Validators.required]);
  } else {
    idSuplenteControl?.clearValidators();
  }
  idSuplenteControl?.updateValueAndValidity();
}

// Método para habilitar o deshabilitar el campo idSuplente y control visual
toggleSuplenteDisabled(necesitaReemplazo: boolean): void {
  const idSuplenteControl = this.novedadPersonalForm.get('idSuplente');
  if (necesitaReemplazo) {
    idSuplenteControl?.enable();
  } else {
    idSuplenteControl?.disable();
    idSuplenteControl?.setValue(null);
  }
}

  // actualizar fechaMinFinal cuando cambia la fecha de inicio
  onFechaInicioChange(): void {
    const fechaInicio = this.novedadPersonalForm.get('fechaInicio')?.value;
    
    // Siempre resetear la fecha final cuando cambia la fecha de inicio
    this.novedadPersonalForm.get('fechaFinal')?.setValue('');  // Resetear fecha final
    
    // Si se seleccionó una fecha de inicio
    if (fechaInicio) {
      // Habilitar el campo fechaFinal y actualizar el valor mínimo
      this.novedadPersonalForm.get('fechaFinal')?.enable();
      this.fechaMinFinal = new Date(fechaInicio);
    } else {
      // Si no se seleccionó fecha de inicio, deshabilitar fechaFinal y resetear valor
      this.novedadPersonalForm.get('fechaFinal')?.disable();
      this.fechaMinFinal = null;
    }
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
      // Habilitar el campo idSuplente después de seleccionar un suplente
      this.novedadPersonalForm.get('idSuplente')?.enable();
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
        novedadPersonal.horaInicio ?? null,
        novedadPersonal.horaFinal ?? null,
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

validateSuplenteDifferent(): void {
  const idSuplenteControl = this.novedadPersonalForm.get('idSuplente');
  if (idSuplenteControl) {
    idSuplenteControl.valueChanges.subscribe(selectedSuplente => {
      if (selectedSuplente && selectedSuplente === this.data.asistencialId) {
        idSuplenteControl.setErrors({ sameAsAsistencial: true });
        this.toastr.error('El suplente no puede ser la misma persona cargada.', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true,
        });
      } else {
        const currentErrors = idSuplenteControl.errors || {};
        delete currentErrors['sameAsAsistencial'];
        idSuplenteControl.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
      }
    });
  }
}
cancel(): void {
    this.dialogRef.close();
  }
}