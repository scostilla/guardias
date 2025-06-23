import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { NovedadPersonalDto } from "src/app/dto/personal/NovedadPersonalDto";
import { Asistencial } from "src/app/models/Configuracion/Asistencial";
import { TipoLicencia } from "src/app/models/Configuracion/TipoLicencia";
import { TipoLicenciaService } from "src/app/services/Configuracion/tipoLicencia.service";
import { NovedadPersonalService } from "src/app/services/personal/novedadPersonal.service";
import { ConsultaLicenciaCompensatorioDto } from "src/app/dto/novedades/ConsultaLicenciaCompensatorioDto";
import { DistribucionGuardiaService } from "src/app/services/personal/distribucionGuardia.service";
import * as moment from 'moment';

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
    fechaMinInicio: string = '';
    fechaMinFinal: Date | null = null;
    idLicencia?: number;
  
    constructor(
        private fb: FormBuilder,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<NovedadesPersonCreateComponent>,
        private novedadPersonalService: NovedadPersonalService,
        private tipoLicenciaService: TipoLicenciaService,
        private distribucionGuardiaService: DistribucionGuardiaService,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: { asistencialId: number; novedadPersonal?: NovedadPersonalDto }
      ) {
        const today = moment();
        let fechaMinInicio: string;
        
        if (today.isoWeekday() === 1) { // 1 = lunes (según ISO)
          fechaMinInicio = today.subtract(2, 'days').format('YYYY-MM-DD');
          } else {
          fechaMinInicio = today.add(1, 'days').format('YYYY-MM-DD');
          }
        this.fechaMinInicio = fechaMinInicio;

        this.novedadPersonalForm = this.fb.group({
          idTipoLicencia: ['', [Validators.required]],
          fechaInicio: ['', Validators.required],
          horaInicio: [''],
          fechaFinal: [{ value: '', disabled: true }, Validators.required],
          horaFinal: [''],
          puedeRealizarGuardia: [''],
          cobraSueldo: [''],
        }, { validators: this.horaFinalPosteriorValidator() });

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
    
        // Llamo al servicio para obtener los tipos de licencia
        this.tipoLicenciaService.list().subscribe((licencia: TipoLicencia[]) => {
          this.licencias = licencia;
      
          // Verifico si 'Compensatorio' están en la lista
          this.idLicencia = this.licencias.find(t => t.nombre === 'Compensatorio')?.id;
      
        });
    
      }

      updateFormFields(tipoLicenciaIdOrNombre: string | number | null): void {
        if (!tipoLicenciaIdOrNombre) return;

        const licencia = typeof tipoLicenciaIdOrNombre === 'string'
          ? this.licencias.find(l => l.nombre.toLowerCase() === tipoLicenciaIdOrNombre.toLowerCase())
          : this.licencias.find(l => l.id === tipoLicenciaIdOrNombre);

        if (!licencia) return;

        const nombre = licencia.nombre.toLowerCase();

        const cobraSueldo = ['licencia anual ordinaria', 'licencia por maternidad'].includes(nombre);
        const puedeRealizarGuardia = ['licencia anual ordinaria', 'compensatorio'].includes(nombre);

        this.novedadPersonalForm.patchValue({
          cobraSueldo,
          puedeRealizarGuardia,
          fechaInicio: '',
          fechaFinal: '',
          horaInicio: '',
          horaFinal: '',
        });

        this.novedadPersonalForm.get('fechaFinal')?.disable();
        this.fechaMinFinal = null;

        // Asignar validadores requeridos a horas si es compensatorio
        if (nombre === 'compensatorio') {
          this.toastr.info('Los compensatorios deben cargarse de a uno por vez (1 x día)', 'Información', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

          this.novedadPersonalForm.get('horaInicio')?.setValidators([Validators.required]);
          this.novedadPersonalForm.get('horaFinal')?.setValidators([Validators.required]);
        } else {
          this.novedadPersonalForm.get('horaInicio')?.clearValidators();
          this.novedadPersonalForm.get('horaFinal')?.clearValidators();
        }

        this.novedadPersonalForm.get('horaInicio')?.updateValueAndValidity();
        this.novedadPersonalForm.get('horaFinal')?.updateValueAndValidity();

        // Revalidar la lógica de fecha/hora en caso ya exista fechaInicio
        this.onFechaInicioChange();
      }
            
      get esCompensatorio(): boolean {
        const tipoLicencia = this.novedadPersonalForm.get('idTipoLicencia')?.value;
        return tipoLicencia === this.idLicencia;
      }    

      onFechaInicioChange(): void {
        const fechaInicio = this.novedadPersonalForm.get('fechaInicio')?.value;

        // Siempre resetear fecha final
        this.novedadPersonalForm.get('fechaFinal')?.setValue('');

        if (fechaInicio) {
          this.fechaMinFinal = new Date(fechaInicio);

          if (this.esCompensatorio) {
            // Si es compensatorio, setear igual y deshabilitar
            this.novedadPersonalForm.get('fechaFinal')?.setValue(fechaInicio);
            this.novedadPersonalForm.get('fechaFinal')?.disable();
          } else {
            // En otros casos, permitir seleccionar fecha final
            this.novedadPersonalForm.get('fechaFinal')?.enable();
          }
        } else {
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

    horaFinalPosteriorValidator(): ValidatorFn {
      return (form: AbstractControl): ValidationErrors | null => {
        const fechaInicio = form.get('fechaInicio')?.value;
        const fechaFinal = form.get('fechaFinal')?.value;
        const horaInicio = form.get('horaInicio')?.value;
        const horaFinal = form.get('horaFinal')?.value;

        if (!fechaInicio || !fechaFinal || !horaInicio || !horaFinal) {
          return null;
        }

        // Solo si las fechas son iguales
        if (fechaInicio !== fechaFinal) {
          return null;
        }

        const [hInicio, mInicio] = horaInicio.split(':').map(Number);
        const [hFinal, mFinal] = horaFinal.split(':').map(Number);

        const minutosInicio = hInicio * 60 + mInicio;
        const minutosFinal = hFinal * 60 + mFinal;

        if (minutosFinal <= minutosInicio) {
          return { horaFinalInvalida: true };
        }

        return null;
      };
    }

  saveNovedadPersonal(): void {
    if (this.novedadPersonalForm.invalid) return;

    const novedadPersonal = this.novedadPersonalForm.getRawValue();

    console.log('Tipo de Licencia recibido:', novedadPersonal.idTipoLicencia);

    const idPersona = this.data.novedadPersonal 
      ? this.data.novedadPersonal.idPersona 
      : this.data.asistencialId;

    const dto: ConsultaLicenciaCompensatorioDto = {
      idPersona: idPersona,
      fechaInicioConsulta: novedadPersonal.fechaInicio,
      fechaFinConsulta: novedadPersonal.fechaFinal,
      horaInicioConsulta: novedadPersonal.horaInicio ?? null,
      horaFinConsulta: novedadPersonal.horaFinal ?? null,
    };

    console.log('DTO enviado a verificación de superposición:', dto);

    // el ID del tipo de licencia compensatorio en la bd es 1
    const ID_COMPENSATORIO = 1;

    if (novedadPersonal.idTipoLicencia === ID_COMPENSATORIO) {
      this.distribucionGuardiaService.verificarSuperposicionConCargo(dto).subscribe({
        next: (haySuperposicion) => {
          if (haySuperposicion) {
            this.toastr.warning(
              'No es posible guardar la novedad. El profesional posee una guardia del Cargo para el rango de fecha ingresado.',
              'Advertencia'
            );
          } else {
            this.guardarNovedad(novedadPersonal, idPersona);
          }
        },
        error: (error) => {
          console.error('Error al verificar superposición:', error);
          this.toastr.error('Ocurrió un error al verificar superposición con cargo.');
        }
      });
    } else {
      // Para otros tipos de licencia, guarda directamente
      this.guardarNovedad(novedadPersonal, idPersona);
    }
  }

  private guardarNovedad(novedadPersonal: any, idPersona: number): void {
    const novedadPersonalDto = new NovedadPersonalDto(
      novedadPersonal.fechaInicio,
      novedadPersonal.fechaFinal,
      novedadPersonal.horaInicio ?? null,
      novedadPersonal.horaFinal ?? null,
      novedadPersonal.puedeRealizarGuardia,
      novedadPersonal.cobraSueldo,
      true,
      idPersona,
      novedadPersonal.idTipoLicencia,
    );

    console.log('Datos a guardar:', novedadPersonalDto);

    this.novedadPersonalService.save(novedadPersonalDto).subscribe({
      next: (result) => {
        console.log('Novedad creada:', result);
        this.dialogRef.close({ type: 'save', data: result });
      },
      error: (error) => {
        console.error('Error al crear la novedad:', error);
        this.dialogRef.close({ type: 'error', data: error });
      }
    });
  }

  cancel(): void {
      this.dialogRef.close();
    }
}