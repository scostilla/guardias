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
      suplente: ['', Validators.required],
      puedeRealizarGuardia: [''],
      cobraSueldo: [''],
      necesitaReemplazo: [''],
    }, { validators: this.dateLessThan('fechaInicio', 'fechaFinal') });

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
  

    this.novedadPersonalForm.get('fechaInicio')?.valueChanges.subscribe(() => {
      this.novedadPersonalForm.get('fechaFinal')?.updateValueAndValidity(); // Actualiza la validez de fechaFinal
    });
  
    this.novedadPersonalForm.get('fechaFinal')?.valueChanges.subscribe(() => {
   
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

  // Suscripción a cambios en 'necesitaReemplazo'
  this.novedadPersonalForm.get('necesitaReemplazo')?.valueChanges.subscribe(value => {
    this.toggleSuplenteValidation(value);
    this.toggleSuplenteDisabled(value);
  });

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