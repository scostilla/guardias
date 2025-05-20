import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NovedadPersonalDto } from 'src/app/dto/personal/NovedadPersonalDto';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { TipoLicencia } from 'src/app/models/Configuracion/TipoLicencia';
import { NovedadPersonal } from 'src/app/models/personal/NovedadPersonal';
import { TipoLicenciaService } from 'src/app/services/Configuracion/tipoLicencia.service';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import * as moment from 'moment';


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
  inputValue: string = '';
  selectedAsistencial?: Asistencial;
  fechaMinFinal: moment.Moment | null = null;
  
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NovedadesPersonEditComponent>,
    private novedadPersonalService: NovedadPersonalService,
    private tipoLicenciaService: TipoLicenciaService,
    @Inject(MAT_DIALOG_DATA) public data: { asistencialId: number; novedadPersonal?: NovedadPersonalDto }
  ) {
    
    this.novedadPersonalForm = this.fb.group({
      tipoLicencia: ['', [Validators.required]],
      fechaInicio: ['', Validators.required],
      horaInicio: [''],
      fechaFinal: ['', Validators.required],
      horaFinal: [''],
      puedeRealizarGuardia: [''],
      cobraSueldo: [''],
    });


    this.listLicencia();
  }

ngOnInit(): void {
  // 1. Set asistencial si existe
  if (this.data.asistencialId) {
    this.novedadPersonalForm.patchValue({ idAsistencial: this.data.asistencialId });
  }

  // 2. Si hay datos de novedad, cargarlos
if (this.data.novedadPersonal) {
  const { idTipoLicencia, horaInicio, horaFinal, ...rest } = this.data.novedadPersonal;

  // Convertir las horas a formato HH:mm si es necesario
  const horaInicioFormateada = moment(horaInicio, 'HH:mm:ss').format('HH:mm');
  const horaFinalFormateada = moment(horaFinal, 'HH:mm:ss').format('HH:mm');

  this.novedadPersonalForm.patchValue({
    ...rest,
    idTipoLicencia: idTipoLicencia || null,
    horaInicio: horaInicioFormateada,  // Asegúrate de dar solo HH:mm
    horaFinal: horaFinalFormateada,    // Asegúrate de dar solo HH:mm
  });

  // Configurar horas según tipo de licencia
  const tipoLicencia = this.novedadPersonalForm.get('tipoLicencia')?.value;
  this.configurarHorasSegunTipoLicencia(tipoLicencia);
  
    console.log('Datos de la novedad personal cargados:', this.data.novedadPersonal);
  }

  // 3. Guardar estado inicial
  this.initialData = this.novedadPersonalForm.value;
  console.log('Datos iniciales del formulario:', this.initialData);

  // 4. Suscripciones
  this.novedadPersonalForm.get('fechaInicio')?.valueChanges.subscribe(() => {
    this.onFechaInicioChange();
    this.actualizarEstadoFechaFinal();
  });

  this.novedadPersonalForm.get('tipoLicencia')?.valueChanges.subscribe(value => {
    if (!this.isUpdating) {
      this.isUpdating = true;
      this.novedadPersonalForm.get('fechaFinal')?.updateValueAndValidity();
      this.isUpdating = false;
    }

    this.configurarHorasSegunTipoLicencia(value);
    console.log('Valor recibido en tipoLicencia:', value);
    this.updateFormFields(value);
  });
}

  get esCompensatorio(): boolean {
    const tipoLicencia = this.novedadPersonalForm.get('tipoLicencia')?.value;
    return tipoLicencia?.nombre === 'Compensatorio';
  }

  private configurarHorasSegunTipoLicencia(selected: any): void {
    const horaInicioCtrl = this.novedadPersonalForm.get('horaInicio');
    const horaFinalCtrl = this.novedadPersonalForm.get('horaFinal');

    const esCompensatorio = selected?.nombre === 'Compensatorio';

    if (esCompensatorio) {
      horaInicioCtrl?.setValidators(Validators.required);
      horaFinalCtrl?.setValidators(Validators.required);
    } else {
      horaInicioCtrl?.clearValidators();
      horaFinalCtrl?.clearValidators();
      horaInicioCtrl?.setValue('');
      horaFinalCtrl?.setValue('');
    }

    horaInicioCtrl?.updateValueAndValidity();
    horaFinalCtrl?.updateValueAndValidity();
  }

private actualizarEstadoFechaFinal(): void {
  const fechaInicio = this.novedadPersonalForm.get('fechaInicio')?.value;
  const fechaFinalCtrl = this.novedadPersonalForm.get('fechaFinal');
  
  if (fechaInicio) {
    fechaFinalCtrl?.enable();
  } else {
    fechaFinalCtrl?.disable();
  }

  fechaFinalCtrl?.updateValueAndValidity();
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
  //const necesitaReemplazo = ['licencia anual ordinaria', 'licencia por maternidad', 'largo tratamiento de salud'].includes(nombre);

  this.novedadPersonalForm.patchValue({
    cobraSueldo,
    puedeRealizarGuardia,
  });
}
  
  // actualizar fechaMinFinal cuando cambia la fecha de inicio
onFechaInicioChange(): void {
  const fechaInicio = this.novedadPersonalForm.get('fechaInicio')?.value;

  if (fechaInicio) {
    const fechaInicioMoment = moment(fechaInicio);
    this.fechaMinFinal = fechaInicioMoment;

    this.novedadPersonalForm.get('fechaFinal')?.setValidators([
      Validators.required,
      this.fechaFinalMinValidator(fechaInicioMoment)
    ]);
    this.novedadPersonalForm.get('fechaFinal')?.updateValueAndValidity();
  } else {
    this.fechaMinFinal = null;
    this.novedadPersonalForm.get('fechaFinal')?.clearValidators();
    this.novedadPersonalForm.get('fechaFinal')?.updateValueAndValidity();
  }
}

fechaFinalMinValidator(minDate: moment.Moment) {
  return (control: AbstractControl) => {
    const value = control.value;
    if (value && moment(value).isBefore(minDate, 'day')) {
      return { minDate: true };
    }
    return null;
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
  
 editNovedadPersonal(): void {
    if (this.novedadPersonalForm.valid) {
      console.log('Valores del formulario:', this.novedadPersonalForm.value);
      const formValue = this.novedadPersonalForm.value;
  
      const novedadPersonalDto = new NovedadPersonalDto(
        formValue.fechaInicio,
        formValue.fechaFinal,
        formValue.horaInicio,
        formValue.horaFinal,
        formValue.puedeRealizarGuardia,
        formValue.cobraSueldo,
        true,
        this.data.asistencialId || formValue.idPersona,
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