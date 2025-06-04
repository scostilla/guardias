import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CronogramaTentativoDto } from 'src/app/dto/Cronogramas/CronogramaTentativoDto';
import { CronogramaTentativoResquestDto } from 'src/app/dto/Cronogramas/CronogramaTentativoResquestDto';
import { ConsultaLicenciaCompensatorioDto } from 'src/app/dto/personal/ConsultaLicenciaCompensatorioDto';
import { DistribucionCheckDto } from 'src/app/dto/personal/distribucionGuardia/DistribucionCheckDto';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { TipoGuardiaService } from 'src/app/services/Configuracion/tipoGuardia.service';
import { AsistencialSelectorComponent } from 'src/app/components/personal/personal-contenido/asistencial-selector/asistencial-selector.component';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { DistribucionConsultorioService } from 'src/app/services/personal/distribucionConsultorio.service';
import { DistribucionGiraService } from 'src/app/services/personal/distribucionGira.service';
import { DistribucionOtroService } from 'src/app/services/personal/distribucionOtro.service';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';
import { Feriado } from 'src/app/models/Configuracion/Feriado';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { ServicioSummaryDto } from 'src/app/dto/Configuracion/ServicioSummaryDto';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ChangeDetectorRef } from '@angular/core';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-cronograma-create',
  templateUrl: './cronograma-create.component.html',
  styleUrls: ['./cronograma-create.component.css']
})
export class CronogramaCreateComponent {

  cronoForm: FormGroup;
  tiposGuardia: any[] = [];
  asistenciales: any[] = [];
  inputValue: string = '';
  efectorId: number | null = null;
  minFechaIngreso: string = moment().format('YYYY-MM-DD');
  minHoraIngreso: string = '00:00';
  minFechaEgreso: string = '';
  servicios: ServicioSummaryDto[] = [];
  feriados: Feriado[] = [];

constructor(
  public dialogRef: MatDialogRef<CronogramaCreateComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private fb: FormBuilder,
  private cronoService: CronogramaTentativoService,
  private asistencialService: AsistencialService,
  private efectorService: EfectorService,
  private hospitalService: HospitalService,
  private tipoGuardiaService: TipoGuardiaService,
  private distribucionGuardiaService: DistribucionGuardiaService,
  private distribucionConsultorioService: DistribucionConsultorioService,
  private distribucionGiraService: DistribucionGiraService,
  private distribucionOtroService: DistribucionOtroService,
  private novedadPersonalService: NovedadPersonalService,
  private feriadoService: FeriadoService,
  public dialog: MatDialog,
  private toastr: ToastrService,
  private cdRef: ChangeDetectorRef
) {
  this.cronoForm = this.fb.group({
    fechaIngreso: ['', Validators.required],
    fechaEgreso: [{ value: '', disabled: true }, Validators.required],
    horaIngreso: ['', Validators.required],
    horaEgreso: [{ value: '', disabled: true }, Validators.required],
    tipoGuardia: ['', Validators.required],
    asistencial: ['', Validators.required],
    idServicio: ['', Validators.required],
    observacion: ['', [Validators.maxLength(250)]],
  });
}

ngOnInit(): void {
  this.obtenerFeriados(); // Esto también ejecuta actualizarMinFechaIngreso()

  this.tipoGuardiaService.list().subscribe(data => {
    this.tiposGuardia = data;
    this.cdRef.detectChanges();
  });

  this.efectorId = this.efectorService.getCurrentEfectorId();
  console.log('Efector seleccionado:', this.efectorId);

  this.cronoForm.get('fechaIngreso')?.valueChanges.subscribe(fecha => {
    const tipo = this.cronoForm.get('tipoGuardia')?.value;

    if (this.esGuardiaComun(tipo)) {
      if (fecha && moment(fecha).isSame(moment(), 'day')) {
        this.minHoraIngreso = moment().format('HH:mm');
      } else {
        this.minHoraIngreso = '00:00';
      }

      const horaControl = this.cronoForm.get('horaIngreso');
      horaControl?.setValidators([
        Validators.required,
        this.validateHoraIngreso(this.minHoraIngreso)
      ]);
      horaControl?.updateValueAndValidity();
    }

    this.updateFechaEgresoRestrictions(fecha);
    this.validateHoraEgreso();
    this.cdRef.detectChanges();
  });

  this.cronoForm.get('tipoGuardia')?.valueChanges.subscribe(() => {
    this.actualizarMinFechaIngreso();
    const fecha = this.cronoForm.get('fechaIngreso')?.value;

    const tipo = this.cronoForm.get('tipoGuardia')?.value;
    if (this.esGuardiaComun(tipo) && fecha && moment(fecha).isSame(moment(), 'day')) {
      this.minHoraIngreso = moment().format('HH:mm');
    } else {
      this.minHoraIngreso = '00:00';
    }

    const horaControl = this.cronoForm.get('horaIngreso');
    horaControl?.setValidators([
      Validators.required,
      this.validateHoraIngreso(this.minHoraIngreso)
    ]);
    horaControl?.updateValueAndValidity();
  });

  this.cronoForm.get('fechaEgreso')?.valueChanges.subscribe(fechaEgreso => {
    this.updateHoraEgresoRestrictions(fechaEgreso);
    this.validateHoraEgreso();
    this.cdRef.detectChanges();
  });

  this.cronoForm.get('horaIngreso')?.valueChanges.subscribe(() => {
    this.validateHoraEgreso();
    this.cdRef.detectChanges();
  });

  this.cronoForm.get('horaEgreso')?.valueChanges.subscribe(() => {
    this.validateHoraEgreso();
    this.cdRef.detectChanges();
  });

  this.obtenerServicios();
}

  onTipoGuardiaChange(event: any): void {
    console.log("Tipo de guardia seleccionado:", event.value);
    const nuevoTipoGuardia = event.value;
    // Cambiar el tipo de guardia y borrar solo los campos relacionados
    this.cambiarTipoGuardia(nuevoTipoGuardia);
  }

  // Método para cambiar el tipo de guardia y borrar solo los campos relacionados
  cambiarTipoGuardia(nuevoTipoGuardia: any): void {
    // Borrar solo los campos relacionados con el tipo de guardia
    this.cronoForm.get('asistencial')?.reset();
    this.cronoForm.get('idServicio')?.reset();
    this.cronoForm.get('fechaIngreso')?.reset();
    this.cronoForm.get('horaIngreso')?.reset();
    this.cronoForm.get('fechaEgreso')?.reset();
    this.cronoForm.get('horaEgreso')?.reset();

    // Actualizar el tipo de guardia en el formulario
    this.cronoForm.get('tipoGuardia')?.setValue(nuevoTipoGuardia);

  }
  

// Función que actualiza las restricciones de la fecha de egreso
updateFechaEgresoRestrictions(fechaIngreso: string | null): void {
  if (fechaIngreso) {
    // Si hay una fecha de ingreso, habilitar la fecha de egreso y setear la fecha mínima
    this.cronoForm.get('fechaEgreso')?.enable();
    this.minFechaEgreso = fechaIngreso;  // Fecha mínima para egreso es la fecha de ingreso
    this.cronoForm.get('fechaEgreso')?.setValidators([ 
      Validators.required,
      this.fechaEgresoValidator.bind(this)
    ]);
  } else {
    // Si no hay fecha de ingreso, deshabilitar fecha de egreso y resetear valor
    this.cronoForm.get('fechaEgreso')?.disable();
    this.cronoForm.get('fechaEgreso')?.reset();
    this.minFechaEgreso = '';
  }
}

private validateHoraIngreso(minHora: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const horaIngreso = control.value;
    if (!horaIngreso || !minHora) return null;

    const ingreso = moment(horaIngreso, 'HH:mm');
    const minimo = moment(minHora, 'HH:mm');

    return ingreso.isBefore(minimo) ? { horaMenorQueMinima: true } : null;
  };
}

private esGuardiaComun(tipo: any): boolean {
  return tipo?.nombre !== 'CARGO' && tipo?.nombre !== 'AGRUPACION';
}

updateHoraEgresoRestrictions(fechaEgreso: string | null): void {
  if (fechaEgreso) {
    // Si hay una fecha de egreso, habilitar horaEgreso
    this.cronoForm.get('horaEgreso')?.enable();
  } else {
    // Si no hay fecha de egreso, deshabilitar horaEgreso y resetear valor
    this.cronoForm.get('horaEgreso')?.disable();
    this.cronoForm.get('horaEgreso')?.reset();
  }
}

// Validador para fecha de egreso (debe ser igual o posterior a fecha de ingreso)
fechaEgresoValidator(control: any): { [key: string]: boolean } | null {
  const fechaIngreso = this.cronoForm.get('fechaIngreso')?.value;
  if (fechaIngreso && control.value < fechaIngreso) {
    return { 'fechaEgresoInvalida': true };
  }
  return null;
}

// Función para validar que horaEgreso sea posterior a horaIngreso si las fechas son iguales
validateHoraEgreso(): void {
  const fechaIngreso: Date = this.cronoForm.get('fechaIngreso')?.value;
  const fechaEgreso: Date = this.cronoForm.get('fechaEgreso')?.value;
  const horaIngreso: string = this.cronoForm.get('horaIngreso')?.value;
  const horaEgreso: string = this.cronoForm.get('horaEgreso')?.value;

  if (fechaIngreso && fechaEgreso && horaIngreso && horaEgreso) {
    // Crear momentos combinando la fecha y la hora
    const ingresoMoment = moment(fechaIngreso).set({
      hour: parseInt(horaIngreso.split(':')[0], 10),
      minute: parseInt(horaIngreso.split(':')[1], 10),
      second: 0,
      millisecond: 0,
    });

    const egresoMoment = moment(fechaEgreso).set({
      hour: parseInt(horaEgreso.split(':')[0], 10),
      minute: parseInt(horaEgreso.split(':')[1], 10),
      second: 0,
      millisecond: 0,
    });

    // Validación
    if (!egresoMoment.isAfter(ingresoMoment)) {
      console.log('La fecha y hora de egreso no es posterior a la de ingreso');
      this.cronoForm.get('horaEgreso')?.setErrors({ 'horaEgresoInvalida': true });
      this.cronoForm.get('fechaEgreso')?.setErrors({ 'fechaEgresoInvalida': true });
    } else {
      console.log('Fecha y hora de egreso válidas');
      this.cronoForm.get('horaEgreso')?.setErrors(null);
      this.cronoForm.get('fechaEgreso')?.setErrors(null);
    }
  }
}

private actualizarMinFechaIngreso(): void {
  const today = moment();
  const tipo = this.cronoForm.get('tipoGuardia')?.value;

  let diasARestar = 0;

  // Partimos desde ayer
  let fechaIterar = today.clone().subtract(1, 'day');

  while (true) {
    const esFeriado = this.feriados.some(f => moment(f.fecha).isSame(fechaIterar, 'day'));
    const esFinDeSemana = [6, 7].includes(fechaIterar.isoWeekday()); // Sábado (6), Domingo (7)

    if (esFeriado || esFinDeSemana) {
      diasARestar++;
      fechaIterar = fechaIterar.subtract(1, 'day');
    } else {
      break; // Se encontró un día hábil → se corta la racha
    }
  }

  // Regla básica según tipo de guardia
  let baseFecha: moment.Moment;
  if (!this.esGuardiaComun(tipo)) {
    baseFecha = today.isoWeekday() === 1
      ? today.clone().subtract(1, 'day')  // Lunes: permite cargar desde el domingo
      : today.clone().add(1, 'day');      // Otro día: desde mañana
  } else {
    baseFecha = today.isoWeekday() === 1
      ? today.clone().subtract(2, 'days') // Lunes: permite cargar desde el sábado
      : today.clone();                    // Otro día: desde hoy
  }

  // Aplicar días extra por feriados/fines consecutivos
  const nuevaFechaMinima = baseFecha.clone().subtract(diasARestar, 'days');
  this.minFechaIngreso = nuevaFechaMinima.format('YYYY-MM-DD');
}

private obtenerFeriados(): void {
  this.feriadoService.list().subscribe((data: Feriado[]) => {
    this.feriados = data; // Guardás los objetos completos
    this.actualizarMinFechaIngreso(); // Recalcular una vez obtenidos
  });
}

  obtenerServicios(): void {
    this.hospitalService.getActiveServicesByHospital(this.efectorId!).subscribe((data: ServicioSummaryDto[]) => {
      this.servicios = data;
    });
  }

  openAsistencialDialog(): void {
    const dialogRef = this.dialog.open(AsistencialSelectorComponent, {
      width: '800px',
      disableClose: true,
      data: {
        idEfector: this.efectorId,
        tipoGuardia: this.cronoForm.get('tipoGuardia')?.value.nombre,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizo el valor legible para mostrarlo y el id para el formulario
        this.inputValue = `${result.apellido} ${result.nombre}`;
        this.cronoForm.patchValue({ asistencial: result.id });
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

  /*saveCronograma(): void {
    if (this.cronoForm.valid) {
      const formData = this.cronoForm.value;
      const cronogramaDto = new CronogramaTentativoDto(
        formData.fechaIngreso,
        formData.fechaEgreso,
        formData.horaIngreso,
        formData.horaEgreso,
        true, // activo
        false, // aceptado
        false, // autorizado
        formData.tipoGuardia.id,
        formData.asistencial,
        formData.idServicio,
        this.efectorId!,
        formData.observacion
      );
  
      // Verificar si ya existe el cronograma
      this.cronoService.existCronograma(cronogramaDto).subscribe(
        exists => {
          if (exists) {
            this.toastr.error(
              'Ya existe una guardia asignada para el profesional en la fecha y hora seleccionada.',
              'Error',
              {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              }
            );
          } else {
            // Si no existe, verificar si hay superposición en otros efectores
            this.cronoService.efectoresConCronograma(cronogramaDto).subscribe(
              efectores => {
                if (efectores && efectores.length > 0) {
                  const lista = efectores.join(', ');
                  this.toastr.warning(
                    `El profesional también está cargado en la misma hora y fecha en los efectores: ${lista}`,
                    'Superposición detectada',
                    {
                      timeOut: 8000,
                      positionClass: 'toast-top-center',
                      progressBar: true
                    }
                  );
                }
  
                // Guardar el cronograma
                this.cronoService.save(cronogramaDto).subscribe(
                  response => {
                    this.toastr.success('Cronograma tentativo guardado', 'Éxito', {
                      timeOut: 6000,
                      positionClass: 'toast-top-center',
                      progressBar: true
                    });
  
                    this.cronoService.refresh$.next();
                    this.dialogRef.close(true);
                  },
                  error => {
                    console.error('Error al guardar el cronograma:', error);
                    this.toastr.error('Hubo un error al guardar el cronograma', 'Error', {
                      timeOut: 6000,
                      positionClass: 'toast-top-center',
                      progressBar: true
                    });
                  }
                );
              },
              error => {
                console.error('Error al verificar efectores con cronograma:', error);
                this.toastr.error('Hubo un error al verificar superposición con otros efectores', 'Error', {
                  timeOut: 6000,
                  positionClass: 'toast-top-center',
                  progressBar: true
                });
              }
            );
          }
        },
        error => {
          console.error('Error al verificar la existencia del cronograma:', error);
          this.toastr.error('Hubo un error al verificar la existencia del cronograma', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
      );
    } else {
      console.log('Formulario no válido');
      this.toastr.error('Por favor complete todos los campos del formulario', 'Formulario inválido', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
    }
  }*/

saveCronograma(): void {
  if (this.cronoForm.valid) {
    const formData = this.cronoForm.value;
    const tipoGuardiaId = formData.tipoGuardia.id;

    const checkDto: DistribucionCheckDto = {
      idPersona: formData.asistencial,
      fecha: formatDate(formData.fechaIngreso, 'yyyy-MM-dd', 'en-US')
    };

    console.log('DistribucionCheckDto enviado:', checkDto);

    this.asistencialService.esCargoAgrupacion(formData.asistencial).subscribe(
      esCargoAgrupacion => {
        if (esCargoAgrupacion) {
          // Si es cargo o agrupación, validar distribución activa
          this.distribucionGuardiaService.tieneDistribucionActiva(checkDto).subscribe(
            tieneDistribucion => {
              if (!tieneDistribucion) {
                this.toastr.error(
                  'Aún no hay una distribución horaria para el profesional.',
                  'Carga no permitida',
                  {
                    timeOut: 9000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                  }
                );
                return;
              }

              // Si tiene distribución, continuar con validaciones normales
              this.validarExistenciaYSuperposicion(formData, tipoGuardiaId);
            },
            error => this.handleError('verificar distribución activa', error)
          );
        } else {
          // Si no es cargo o agrupación, continuar directamente
          this.validarExistenciaYSuperposicion(formData, tipoGuardiaId);
        }
      },
      error => this.handleError('verificar tipo de asistencial (cargo o agrupación)', error)
    );
  } else {
    this.toastr.error('Por favor complete todos los campos del formulario', 'Formulario inválido', {
      timeOut: 9000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
  }
}

private validarExistenciaYSuperposicion(formData: any, tipoGuardiaId: number): void {
  const cronogramaDto = new CronogramaTentativoDto(
    formData.fechaIngreso,
    formData.fechaEgreso,
    formData.horaIngreso,
    formData.horaEgreso,
    true,
    false,
    'PENDIENTE',
    tipoGuardiaId,
    formData.asistencial,
    formData.idServicio,
    this.efectorId!,
    formData.observacion
  );

  this.cronoService.existCronograma(cronogramaDto).subscribe(
    exists => {
      if (exists) {
        this.toastr.error(
          'Ya existe una guardia tentativa asignada para el profesional en la fecha y hora seleccionada.',
          'Error',
          {
            timeOut: 9000,
            positionClass: 'toast-top-center',
            progressBar: true
          }
        );
      } else {
        this.cronoService.efectoresConCronograma(cronogramaDto).subscribe(
          efectores => {
            if (efectores && efectores.length > 0) {
              const lista = efectores.join(', ');
              this.toastr.warning(
                `El profesional también está cargado en la misma hora y fecha en los efectores: ${lista}. Verifique si efectivamente llevará a cabo la guardia en su establecimiento.`,
                'Superposición detectada',
                {
                  timeOut: 9000,
                  positionClass: 'toast-top-center',
                  progressBar: true
                }
              );
            }

            this.guardarCronogramaConVerificaciones(cronogramaDto);
          },
          error => this.handleError('verificar efectores con cronograma', error)
        );
      }
    },
    error => this.handleError('verificar la existencia del cronograma', error)
  );
}


private guardarCronogramaConVerificaciones(cronogramaDto: CronogramaTentativoDto): void {
  const tipoGuardiaId = cronogramaDto.idTipoGuardia;
    
  if (tipoGuardiaId === 1 || tipoGuardiaId === 2) {
    this.procesarCronogramaCargoOAgrupacion(cronogramaDto);
  } else if (tipoGuardiaId === 3) {
    this.procesarCronogramaExtra(cronogramaDto);
  } else {
    // Otros tipos (CF y PASIVA?): guardar con autorizado en true
    cronogramaDto.autorizado = 'CONFIRMADO';
    this.toastr.success('Guardia autorizada', undefined, {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.guardarCronogramaConAutorizacion(cronogramaDto);
  }
}

private mapearTipoGuardia(id: number): string {
    switch (id) {
        case 1: return 'CARGO';
        case 2: return 'AGRUPACION';
        case 3: return 'EXTRA';
        case 4: return 'CONTRAFACTURA';
        default: 
            console.warn('Tipo de guardia no reconocido:', id);
            return 'DESCONOCIDO'; // o lanza un error si es crítico
    }}
    
  private procesarCronogramaCargoOAgrupacion(cronogramaDto: CronogramaTentativoDto): void {
    const tipoGuardiaString = this.mapearTipoGuardia(cronogramaDto.idTipoGuardia);

  console.log('Datos recibidos en procesarCronogramaCargoOAgrupacion:', {
    idAsistencial: cronogramaDto.idAsistencial,
    idEfector: cronogramaDto.idEfector,
    tipoGuardiaString,
    fechaIngreso: cronogramaDto.fechaIngreso,
    horaIngreso: cronogramaDto.horaIngreso,
    horaEgreso: cronogramaDto.horaEgreso
  });
  
    // Adaptar el objeto a CronogramaTentativoResquestDto
  const cronogramaRequest = new CronogramaTentativoResquestDto(
    cronogramaDto.idAsistencial,
    cronogramaDto.idEfector,
    tipoGuardiaString,
    cronogramaDto.fechaIngreso,
    cronogramaDto.horaIngreso,
    cronogramaDto.horaEgreso
  );

  this.distribucionGuardiaService.existeTentativoEnDistribucionGuardia(cronogramaRequest).subscribe(
    respuesta => {
      console.log('Respuesta de existeTentativoEnDistribucionGuardia:', respuesta);
      if (respuesta.coincideExactamente) {
        cronogramaDto.autorizado = 'CONFIRMADO';
        cronogramaDto.aceptado = true;

        this.toastr.success('Guardia autorizada', undefined, {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        this.guardarCronogramaConAutorizacion(cronogramaDto);
      } else if (respuesta.existeDistribucionParcial) {
        cronogramaDto.autorizado = 'PENDIENTE';
        cronogramaDto.aceptado = true;

        this.toastr.warning('La guardia ingresada no coincide con la cargada en Distribución Horaria. Guardia pendiente de autorización.', undefined, {
          timeOut: 9000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        this.guardarCronogramaConAutorizacion(cronogramaDto);
      } else if (respuesta.sinDistribucion) {
        this.distribucionConsultorioService.existeTentativoEnDistribucionConsultorio(cronogramaRequest).subscribe(
          existeEnConsultorio => {
            if (existeEnConsultorio) {
              cronogramaDto.autorizado = 'PENDIENTE';

              this.toastr.warning('El profesional ya posee otra actividad. Guardia pendiente de autorización.', undefined, {
                timeOut: 9000,
                positionClass: 'toast-top-center',
                progressBar: true
              });

              this.guardarCronogramaConAutorizacion(cronogramaDto);
            } else {
              this.distribucionGiraService.existeTentativoEnDistribucionGira(cronogramaRequest).subscribe(
                existeEnGira => {
                  if (existeEnGira) {
                    cronogramaDto.autorizado = 'PENDIENTE';

                    this.toastr.warning('El profesional ya posee otra actividad. Guardia pendiente de autorización.', undefined, {
                      timeOut: 9000,
                      positionClass: 'toast-top-center',
                      progressBar: true
                    });

                    this.guardarCronogramaConAutorizacion(cronogramaDto);
                  } else {
                    this.distribucionOtroService.existeTentativoEnDistribucionOtro(cronogramaRequest).subscribe(
                      existeEnOtro => {
                        if (existeEnOtro) {
                          cronogramaDto.autorizado = 'PENDIENTE';

                          this.toastr.warning('El profesional ya posee otra actividad. Guardia pendiente de autorización.', undefined, {
                            timeOut: 9000,
                            positionClass: 'toast-top-center',
                            progressBar: true
                          });
                        } else {
                          cronogramaDto.autorizado = 'CONFIRMADO';

                          this.toastr.success('Guardia autorizada', undefined, {
                            timeOut: 6000,
                            positionClass: 'toast-top-center',
                            progressBar: true
                          });
                        }

                        this.guardarCronogramaConAutorizacion(cronogramaDto);
                      },
                      error => this.handleError('verificar en distribución Otro', error)
                    );
                  }
                },
                error => this.handleError('verificar en distribución Gira', error)
              );
            }
          },
          error => this.handleError('verificar en distribución Consultorio', error)
        );
      }
    },
    error => this.handleError('verificar en distribución Guardia', error)
  );
}

private procesarCronogramaExtra(cronogramaDto: CronogramaTentativoDto): void {
  
  const tipoGuardiaString = this.mapearTipoGuardia(cronogramaDto.idTipoGuardia);

  console.log('Datos recibidos en procesarCronogramaEXTRA:', {
    idAsistencial: cronogramaDto.idAsistencial,
    idEfector: cronogramaDto.idEfector,
    tipoGuardiaString,
    fechaIngreso: cronogramaDto.fechaIngreso,
    horaIngreso: cronogramaDto.horaIngreso,
    horaEgreso: cronogramaDto.horaEgreso
  });
  
    // Adaptar el objeto a CronogramaTentativoResquestDto
  const cronogramaRequest = new CronogramaTentativoResquestDto(
    cronogramaDto.idAsistencial,
    cronogramaDto.idEfector,
    tipoGuardiaString,
    cronogramaDto.fechaIngreso,
    cronogramaDto.horaIngreso,
    cronogramaDto.horaEgreso
  );

const fechaIngresoStr = moment(cronogramaDto.fechaIngreso).format('YYYY-MM-DD');
const horaIngresoStr = moment(cronogramaDto.horaIngreso, 'HH:mm').format('HH:mm:ss');
const fechaEgresoStr = moment(cronogramaDto.fechaEgreso).format('YYYY-MM-DD');
const horaEgresoStr = moment(cronogramaDto.horaEgreso, 'HH:mm').format('HH:mm:ss');

const cronogramaCompensatorio = new ConsultaLicenciaCompensatorioDto(
  cronogramaDto.idAsistencial,
  fechaIngresoStr,
  horaIngresoStr,
  fechaEgresoStr,
  horaEgresoStr
);
    console.log('Consulta a licencia compensatorio (payload):', {
  idPersona: cronogramaDto.idAsistencial,
  fechaIngresoStr,
  horaIngresoStr,
  fechaEgresoStr,
  horaEgresoStr

});
console.log('Datos enviados a existeTentativoEnDistribucionGuardia:', cronogramaRequest);
  this.distribucionGuardiaService.existeTentativoEnDistribucionGuardia(cronogramaRequest).subscribe(
    respuesta => {
      console.log('Respuesta de existeTentativoEnDistribucionGuardiaEXTRA:', respuesta);
      if (respuesta.coincideExactamente || respuesta.existeDistribucionParcial) {
                const fechaIngreso = new Date(cronogramaDto.fechaIngreso);
                const fechaConsulta = fechaIngreso.toISOString().split('T')[0];
                
                console.log('Datos para tieneLicenciaLAO:', {
                idAsistencial: cronogramaDto.idAsistencial,
                fechaConsulta: fechaConsulta,
                tipoGuardia: cronogramaRequest.tipoGuardia // Verificar congruencia
            });
        this.novedadPersonalService.tieneLicenciaLAO(cronogramaDto.idAsistencial, fechaConsulta).subscribe(
          tieneLAO => {
             console.log('[LicenciaLAO] Respuesta del servicio:', {
      timestamp: new Date().toISOString(),
      request: {
        idAsistencial: cronogramaDto.idAsistencial,
        fechaConsulta: fechaConsulta,
        tipoGuardia: cronogramaDto.idTipoGuardia // Opcional: para contexto
      },
      response: tieneLAO,
      autorizacionResultante: tieneLAO ? 'CONFIRMADO' : 'PENDIENTE'
    });
            if (tieneLAO) {
              cronogramaDto.autorizado = 'CONFIRMADO';

              this.toastr.success('Guardia autorizada', undefined, {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });

              this.guardarCronogramaConAutorizacion(cronogramaDto);
            } else {
              this.novedadPersonalService.tieneLicenciaCompensatorio(cronogramaCompensatorio).subscribe(
                tieneCompensatorio => {
                  if (tieneCompensatorio) {
                    cronogramaDto.autorizado = 'CONFIRMADO';

                    this.toastr.success('Guardia autorizada', undefined, {
                      timeOut: 6000,
                      positionClass: 'toast-top-center',
                      progressBar: true
                    });

                    this.guardarCronogramaConAutorizacion(cronogramaDto);
                  } else {
                    // No se autoriza ni se guarda
                    this.toastr.error(
                      'El profesional posee una guardia del CARGO activa, no puede asignar una guardia EXTRA en el horario requerido',
                      'Asignación no permitida',
                      {
                        timeOut: 9000,
                        positionClass: 'toast-top-center',
                        progressBar: true
                      }
                    );
                  }
                },
                error => this.handleError('verificar licencia compensatorio', error)
              );
            }
          },
          error => this.handleError('verificar licencia LAO', error)
        );
       } else if (respuesta.sinDistribucion) {
        this.distribucionConsultorioService.existeTentativoEnDistribucionConsultorio(cronogramaRequest).subscribe(
          enConsultorio => {
            if (enConsultorio) {
              cronogramaDto.autorizado = 'PENDIENTE';

              this.toastr.warning('El profesional ya posee otra actividad. Guardia pendiente de autorización.', undefined, {
                timeOut: 9000,
                positionClass: 'toast-top-center',
                progressBar: true
              });

              this.guardarCronogramaConAutorizacion(cronogramaDto);
            } else {
              this.distribucionGiraService.existeTentativoEnDistribucionGira(cronogramaRequest).subscribe(
                enGira => {
                  if (enGira) {
                    cronogramaDto.autorizado = 'PENDIENTE';

                    this.toastr.warning('El profesional ya posee otra actividad. Guardia pendiente de autorización.', undefined, {
                      timeOut: 9000,
                      positionClass: 'toast-top-center',
                      progressBar: true
                    });

                    this.guardarCronogramaConAutorizacion(cronogramaDto);
                  } else {
                    this.distribucionOtroService.existeTentativoEnDistribucionOtro(cronogramaRequest).subscribe(
                      enOtro => {
                        if (enOtro) {
                          cronogramaDto.autorizado = 'PENDIENTE';

                          this.toastr.warning('El profesional ya posee otra actividad. Guardia pendiente de autorización.', undefined, {
                            timeOut: 9000,
                            positionClass: 'toast-top-center',
                            progressBar: true
                          });
                        } else {
                          cronogramaDto.autorizado = 'CONFIRMADO';

                          this.toastr.success('Guardia autorizada', undefined, {
                            timeOut: 6000,
                            positionClass: 'toast-top-center',
                            progressBar: true
                          });
                        }

                        this.guardarCronogramaConAutorizacion(cronogramaDto);
                      },
                      error => this.handleError('verificar en distribución Otro', error)
                    );
                  }
                },
                error => this.handleError('verificar en distribución Gira', error)
              );
            }
          },
          error => this.handleError('verificar en distribución Consultorio', error)
        );
      }
    },
    error => this.handleError('verificar en distribución Guardia', error)
  );
}
    
    private guardarCronogramaConAutorizacion(cronogramaDto: CronogramaTentativoDto): void {
      this.cronoService.save(cronogramaDto).subscribe(
        response => {
          this.toastr.success('Cronograma tentativo guardado', 'Éxito', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
    
          this.cronoService.refresh$.next();
          this.dialogRef.close(true);
        },
        error => this.handleError('guardar el cronograma', error)
      );
    }
    
    private handleError(context: string, error: any): void {
      console.error(`Error al ${context}:`, error);
      this.toastr.error(`Hubo un error al ${context}`, 'Error', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
    }
    
    
  closeDialog(): void {
    this.dialogRef.close();
  }
}