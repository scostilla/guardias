import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AsistencialSelectorComponent } from 'src/app/components/personal/personal-contenido/asistencial-selector/asistencial-selector.component';
import { NovedadPersonalDto } from 'src/app/dto/personal/NovedadPersonalDto';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { TipoLicencia } from 'src/app/models/Configuracion/TipoLicencia';
import { NovedadPersonal } from 'src/app/models/guardias/NovedadPersonal';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { TipoLicenciaService } from 'src/app/services/Configuracion/tipoLicencia.service';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';


@Component({
  selector: 'app-novedades-person-edit',
  templateUrl: './novedades-person-edit.component.html',
  styleUrls: ['./novedades-person-edit.component.css']
})
export class NovedadesPersonEditComponent implements OnInit {
  novedadPersonalForm: FormGroup;
  isUpdating = false;


  initialData: NovedadPersonal | undefined;
  idAsistencial: number = 0;

  licencias: TipoLicencia[] = [];
  suplentes?: Asistencial | undefined;
  inputValue: string = '';
  selectedAsistencial?: Asistencial;


  
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NovedadesPersonEditComponent>,
    private novedadPersonalService: NovedadPersonalService,
    private tipoLicenciaService: TipoLicenciaService,
    private asistencialService: AsistencialService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { asistencialId: number; novedadPersonal?: NovedadPersonalDto }
  ) {
    
    this.novedadPersonalForm = this.fb.group({
      tipoLicencia: ['', [Validators.required]],
      fechaInicio: ['', Validators.required],
      fechaFinal: [{ value: '', disabled: true }, Validators.required], 
      suplente: [{ value: '', disabled: true }],
      puedeRealizarGuardia: [''],
      cobraSueldo: [''],
      necesitaReemplazo:[{ value: '', disabled: true }],
    }, { validators: this.dateLessThan('fechaInicio', 'fechaFinal') });

    this.novedadPersonalForm.get('necesitaReemplazo')?.enable();
    this.novedadPersonalForm.get('suplente')?.disable();

    this.listLicencia();
  }

  ngOnInit(): void {

    this.novedadPersonalForm.get('tipoLicencia')?.valueChanges.subscribe(value => {
      if (!this.isUpdating) { // Evita ciclos
        this.isUpdating = true;
        this.novedadPersonalForm.get('fechaFinal')?.updateValueAndValidity();
        this.isUpdating = false;
      }
    });
  

  // Esta suscripción asegura que cuando cambie 'fechaInicio', 'fechaFinal' se limpie.
  this.novedadPersonalForm.get('fechaInicio')?.valueChanges.subscribe(value => {
    if (value) {
      this.novedadPersonalForm.get('fechaFinal')?.enable();
      this.novedadPersonalForm.get('fechaFinal')?.setValue(''); // Limpiar el valor de fechaFinal
    } else {
      this.novedadPersonalForm.get('fechaFinal')?.disable();
    }
    this.novedadPersonalForm.get('fechaFinal')?.updateValueAndValidity(); // Revalidar
  });
  
    // Si el asistencialId está disponible en los datos inyectados
  if (this.data.asistencialId) {
    this.novedadPersonalForm.patchValue({ idAsistencial: this.data.asistencialId });
  }
    this.initialData = this.novedadPersonalForm.value;
    console.log('Datos iniciales del formulario:', this.initialData);

    

    // Carga inicial de datos
    if (this.data.novedadPersonal) {
      const { idTipoLicencia, ...rest } = this.data.novedadPersonal;
      this.novedadPersonalForm.patchValue({
        ...rest,
        idTipoLicencia: idTipoLicencia ? idTipoLicencia : null,
      });
      

      console.log('Datos de la novedad personal cargados:', this.data.novedadPersonal);
  
       // Habilitar fechaFinal si ya existe fechaInicio
       if (this.novedadPersonalForm.get('fechaInicio')?.value) {
        this.novedadPersonalForm.get('fechaFinal')?.enable();
      }
    
      
  
      // Ajustar la validación y habilitación del campo idSuplente en función de necesitaReemplazo
      const necesitaReemplazo = this.novedadPersonalForm.get('necesitaReemplazo')?.value;
      this.toggleSuplenteValidation(necesitaReemplazo);
      this.toggleSuplenteDisabled(necesitaReemplazo);
      this.novedadPersonalForm.updateValueAndValidity();
    }

  // Suscripción para controlar cambios en fechaInicio y fechaFinal
  this.novedadPersonalForm.get('fechaInicio')?.valueChanges.subscribe(value => {
    if (value) {
      this.novedadPersonalForm.get('fechaFinal')?.enable();
    } else {
      this.novedadPersonalForm.get('fechaFinal')?.disable();
    }
    this.novedadPersonalForm.get('fechaFinal')?.updateValueAndValidity();
  });

  this.novedadPersonalForm.get('tipoLicencia')?.valueChanges.subscribe(value => {
    console.log('Valor recibido en tipoLicencia:', value);
    this.updateFormFields(value);
  });

  // Suscripción a cambios en 'necesitaReemplazo'
  this.novedadPersonalForm.get('necesitaReemplazo')?.valueChanges.subscribe(value => {
    this.toggleSuplenteValidation(value);
    this.toggleSuplenteDisabled(value);
  });

  this.validateSuplenteDifferent();

  const necesitaReemplazo = this.novedadPersonalForm.get('necesitaReemplazo')?.value || false;
        this.toggleSuplenteValidation(necesitaReemplazo);
        this.toggleSuplenteDisabled(necesitaReemplazo);
          // Iniciar con el campo necesitaReemplazo oculto
  this.showNecesitaReemplazo(false);

  }

  updateFormFields(tipoLicenciaIdOrNombre: string | number | TipoLicencia | null): void {
    if (!tipoLicenciaIdOrNombre) {
      console.warn('El valor recibido en updateFormFields es nulo o indefinido.');
      return;
    }
  
   // Si el valor recibido es un objeto TipoLicencia, usa su id o nombre
  const licencia = (typeof tipoLicenciaIdOrNombre === 'object' && tipoLicenciaIdOrNombre !== null)
  ? this.licencias.find((l) => l.id === tipoLicenciaIdOrNombre.id) // Suponiendo que el objeto tiene una propiedad id
  : this.licencias.find((l) => l.id === tipoLicenciaIdOrNombre || l.nombre.toLowerCase() === tipoLicenciaIdOrNombre?.toString().toLowerCase());

if (!licencia) {
  console.warn('No se encontró un tipo de licencia con el valor proporcionado:', tipoLicenciaIdOrNombre);
  return;
}
  
    console.log('Licencia encontrada:', licencia);

     // Actualiza los valores en el formulario basados en la licencia encontrada
  const nombre = licencia.nombre.toLowerCase();
  const cobraSueldo = ['licencia anual ordinaria', 'licencia por maternidad'].includes(nombre);
  const puedeRealizarGuardia = ['licencia anual ordinaria', 'compensatorio'].includes(nombre);
  const necesitaReemplazo = ['licencia anual ordinaria', 'licencia por maternidad', 'largo tratamiento de salud'].includes(nombre);

  this.novedadPersonalForm.patchValue({
    cobraSueldo,
    puedeRealizarGuardia,
    necesitaReemplazo: necesitaReemplazo ? '' : '',  // Mantener vacío en lugar de false
  });
  
     // Re-validación y habilitación de campos
  if (necesitaReemplazo) {
    this.novedadPersonalForm.get('necesitaReemplazo')?.enable();
    this.novedadPersonalForm.get('necesitaReemplazo')?.setValidators([Validators.required]);
  } else {
    this.novedadPersonalForm.get('necesitaReemplazo')?.disable();
    this.novedadPersonalForm.get('necesitaReemplazo')?.clearValidators();
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

  toggleSuplenteValidation(necesitaReemplazo: boolean): void {
    const idSuplenteControl = this.novedadPersonalForm.get('suplente');
    
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
    const idSuplenteControl = this.novedadPersonalForm.get('suplente');
    
    if (necesitaReemplazo) {
      idSuplenteControl?.enable();
    } else {
      idSuplenteControl?.disable();
      idSuplenteControl?.setValue(null);
    }
  }

  // Validador personalizado para comprobar que la fechaFinal no sea anterior a fechaInicio
  // Función de validación personalizada para comprobar que fechaFinal no sea anterior a fechaInicio
dateLessThan(start: string, end: string) {
  return (formGroup: AbstractControl) => {
    const startControl = formGroup.get(start);
    const endControl = formGroup.get(end);

    if (startControl && endControl) {
      const startValue = startControl.value;
      const endValue = endControl.value;

      // Si ambas fechas están definidas
      if (startValue && endValue && new Date(endValue) < new Date(startValue)) {
        endControl.setErrors({ dateLessThan: true }); // Establecer error
        return { dateLessThan: true };
      } else {
        const currentErrors = endControl.errors;
        if (currentErrors) {
          delete currentErrors['dateLessThan']; // Eliminar el error si ya no aplica
          if (Object.keys(currentErrors).length === 0) {
            endControl.setErrors(null); // Limpiar errores si no quedan más
          } else {
            endControl.setErrors(currentErrors); // Mantener otros errores
          }
        }
        return null; // Validación exitosa
      }
    }
    return null; // Validación exitosa si no hay fechas
  };
}


  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.novedadPersonalForm.value);
  }

  listLicencia(): void {
    this.tipoLicenciaService.list().subscribe(data => {
      this.licencias = data;
      console.log('Listado de licencias:', data);
    }, error => {
      console.log(error);
    });
  }

 

  openAsistencialDialog(): void {
    const dialogRef = this.dialog.open(AsistencialSelectorComponent, {
      width: '800px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedAsistencial = result;
        this.novedadPersonalForm.patchValue({ suplente: result }); // Asignar el objeto completo
        console.log('Suplente seleccionado:', result);
      } else {
        this.toastr.info('No se seleccionó un profesional', 'Información', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true,
        });
      }
    });
  }

  validateSuplenteDifferent(): void {
    const suplenteControl = this.novedadPersonalForm.get('suplente');
    if (suplenteControl) {
      suplenteControl.valueChanges.subscribe(selectedSuplente => {
        if (selectedSuplente && selectedSuplente.id === this.data.asistencialId) {
          suplenteControl.setErrors({ sameAsAsistencial: true });
          this.toastr.error('El suplente no puede ser la misma persona cargada.', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true,
          });
        } else {
          if (suplenteControl.errors) {
            const currentErrors = suplenteControl.errors;
            delete currentErrors['sameAsAsistencial'];
            if (Object.keys(currentErrors).length === 0) {
              suplenteControl.setErrors(null); // Limpiar errores si no quedan más
            } else {
              suplenteControl.setErrors(currentErrors);
            }
          }
        }
      });
    }
  }
  
/*   get suplenteNombre(): string {
    // Asegúrate de que este getter devuelva solo el nombre del suplente
    return this.selectedAsistencial ? this.selectedAsistencial.nombre : '';
  }
 */

 editNovedadPersonal(): void {
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
        this.data.asistencialId || formValue.idPersona, // Asegúrate de asignar un valor válido aquí
        formValue.suplente.id,
        formValue.tipoLicencia.id,
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

 

  compareFn(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  compareFn_id(o1: any, o2: any): boolean {
    return o1 && o2 ? o1 === o2 : o1 === o2;
  }

  comparteTipoLicencia(p1: TipoLicencia, p2: TipoLicencia): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancel(): void {
    this.dialogRef.close();
  }
}