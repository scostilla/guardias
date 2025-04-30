import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CronogramaTentativoDto } from 'src/app/dto/Cronogramas/CronogramaTentativoDto';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { TipoGuardiaService } from 'src/app/services/Configuracion/tipoGuardia.service';
import { AsistencialSelectorComponent } from 'src/app/components/personal/personal-contenido/asistencial-selector/asistencial-selector.component';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { DistribucionConsultorioService } from 'src/app/services/personal/distribucionConsultorio.service';
import { DistribucionGiraService } from 'src/app/services/personal/distribucionGira.service';
import { DistribucionOtroService } from 'src/app/services/personal/distribucionOtro.service';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { ServicioSummaryDto } from 'src/app/dto/Configuracion/ServicioSummaryDto';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ChangeDetectorRef } from '@angular/core';


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
  currentDate: Date = new Date();
  tomorrowDate: Date = new Date(this.currentDate);
  minFechaIngreso: string = '';
  minFechaEgreso: string = '';
  servicios: ServicioSummaryDto[] = [];

  constructor(
    public dialogRef: MatDialogRef<CronogramaCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cronoService: CronogramaTentativoService,
    private efectorService: EfectorService,
    private hospitalService: HospitalService,
    private tipoGuardiaService: TipoGuardiaService,
    private distribucionGuardiaService: DistribucionGuardiaService,
    private distribucionConsultorioService: DistribucionConsultorioService,
    private distribucionGiraService: DistribucionGiraService,
    private distribucionOtroService: DistribucionOtroService,
    private novedadPersonalService: NovedadPersonalService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef
  ) {
    this.currentDate = new Date();
    this.tomorrowDate.setDate(this.currentDate.getDate() + 1);
    this.minFechaIngreso = this.tomorrowDate.toISOString().split('T')[0];

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
    this.tipoGuardiaService.list().subscribe(data => {
      this.tiposGuardia = data;
      this.cdRef.detectChanges(); // Forzar la detección de cambios
    });
  
    this.efectorId = this.efectorService.getCurrentEfectorId();
    console.log('Efector seleccionado:', this.efectorId);
  
    // Suscripción a los cambios de fechaIngreso
    this.cronoForm.get('fechaIngreso')?.valueChanges.subscribe(fechaIngreso => {
      this.updateFechaEgresoRestrictions(fechaIngreso);
      this.validateHoraEgreso(); // Validar cada vez que cambia la fechaIngreso
      this.cdRef.detectChanges(); // Forzar la detección de cambios
    });
  
    // Suscripción a los cambios de fechaEgreso
    this.cronoForm.get('fechaEgreso')?.valueChanges.subscribe(fechaEgreso => {
      this.updateHoraEgresoRestrictions(fechaEgreso);
      this.validateHoraEgreso(); // Validar cada vez que cambia la fechaEgreso
      this.cdRef.detectChanges(); // Forzar la detección de cambios
    });
  
    // Suscripción a los cambios de horaIngreso
    this.cronoForm.get('horaIngreso')?.valueChanges.subscribe(() => {
      this.validateHoraEgreso(); // Validar cada vez que cambia horaIngreso
      this.cdRef.detectChanges(); // Forzar la detección de cambios
    });
  
    // Suscripción a los cambios de horaEgreso
    this.cronoForm.get('horaEgreso')?.valueChanges.subscribe(() => {
      this.validateHoraEgreso(); // Validar cada vez que cambia horaEgreso
      this.cdRef.detectChanges(); // Forzar la detección de cambios
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
  // Asegúrate de que `horaIngreso` y `horaEgreso` están bien definidos
  const fechaIngreso = this.cronoForm.get('fechaIngreso')?.value;
  const fechaEgreso = this.cronoForm.get('fechaEgreso')?.value;
  const horaIngreso = this.cronoForm.get('horaIngreso')?.value;
  const horaEgreso = this.cronoForm.get('horaEgreso')?.value;

  //console.log('Fecha de Ingreso:', fechaIngreso);
  //console.log('Fecha de Egreso:', fechaEgreso);
  //console.log('Hora de Ingreso:', horaIngreso);
  //console.log('Hora de Egreso:', horaEgreso);

  // Asegúrate de que solo se haga la validación si las fechas son iguales
  if (fechaIngreso && fechaEgreso) {
    // Si fechaIngreso y fechaEgreso son la misma fecha, validar horaEgreso
    if (fechaIngreso.isSame(fechaEgreso, 'day')) {  // Comparar las fechas solo por el día
      // Convertir horaIngreso y horaEgreso a Moment para compararlas
      const horaIngresoMoment = moment(horaIngreso, 'HH:mm');
      const horaEgresoMoment = moment(horaEgreso, 'HH:mm');
      
      //console.log('Hora de Ingreso como Moment:', horaIngresoMoment);
      //console.log('Hora de Egreso como Moment:', horaEgresoMoment);

      // Si horaEgreso es menor o igual a horaIngreso, establecer el error
      if (horaEgresoMoment.isBefore(horaIngresoMoment) || horaEgresoMoment.isSame(horaIngresoMoment)) {
        console.log('Hora de egreso no válida');
        this.cronoForm.get('horaEgreso')?.setErrors({ 'horaEgresoInvalida': true });
      } else {
        console.log('Hora de egreso válida');
        this.cronoForm.get('horaEgreso')?.setErrors(null); // Remover cualquier error
      }
    }
  }
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
    
        const cronogramaDto = new CronogramaTentativoDto(
          formData.fechaIngreso,
          formData.fechaEgreso,
          formData.horaIngreso,
          formData.horaEgreso,
          true, // activo
          false, // aceptado (por defecto)
          'PENDIENTE', // autorizado (por defecto)
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
                  timeOut: 6000,
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
    
                  // Enviar a lógica según tipo de guardia
                  this.guardarCronogramaConVerificaciones(cronogramaDto);
                },
                error => this.handleError('verificar efectores con cronograma', error)
              );
            }
          },
          error => this.handleError('verificar la existencia del cronograma', error)
        );
      } else {
        console.log('Formulario no válido');
        this.toastr.error('Por favor complete todos los campos del formulario', 'Formulario inválido', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }
    
    private guardarCronogramaConVerificaciones(cronogramaDto: CronogramaTentativoDto): void {
      const tipoGuardiaId = cronogramaDto.idTipoGuardia;
    
      if (tipoGuardiaId === 1 || tipoGuardiaId === 2) {
        this.procesarCronogramaCargoOAgrupacion(cronogramaDto);
      } else if (tipoGuardiaId === 3) {
        this.procesarCronogramaExtra(cronogramaDto);
      } else {
        // Otros tipos (CARGO y PASIVA?): guardar con autorizado en true
        cronogramaDto.autorizado = 'CONFIRMADO';
        this.toastr.success('Guardia autorizada', undefined, {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.guardarCronogramaConAutorizacion(cronogramaDto);
      }
    }
    
    private procesarCronogramaCargoOAgrupacion(cronogramaDto: CronogramaTentativoDto): void {
      this.distribucionGuardiaService.existeTentativoEnDistribucionGuardia(cronogramaDto).subscribe(
        existeEnGuardia => {
          if (existeEnGuardia) {
            cronogramaDto.autorizado = 'CONFIRMADO';
            cronogramaDto.aceptado = true;

            this.toastr.success('Guardia autorizada', undefined, {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          
            this.guardarCronogramaConAutorizacion(cronogramaDto);
          } else {
            this.distribucionConsultorioService.existeTentativoEnDistribucionConsultorio(cronogramaDto).subscribe(
              existeEnConsultorio => {
                if (existeEnConsultorio) {
                  cronogramaDto.autorizado = 'PENDIENTE';

                  this.toastr.warning('El profesional ya posee otra actividad. Guardia pendiente de autorización.', undefined, {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                  });

                  this.guardarCronogramaConAutorizacion(cronogramaDto);
                } else {
                  this.distribucionGiraService.existeTentativoEnDistribucionGira(cronogramaDto).subscribe(
                    existeEnGira => {
                      if (existeEnGira) {
                        cronogramaDto.autorizado = 'PENDIENTE';

                        this.toastr.warning('El profesional ya posee otra actividad. Guardia pendiente de autorización.', undefined, {
                          timeOut: 6000,
                          positionClass: 'toast-top-center',
                          progressBar: true
                        });

                        this.guardarCronogramaConAutorizacion(cronogramaDto);
                      } else {
                        this.distribucionOtroService.existeTentativoEnDistribucionOtro(cronogramaDto).subscribe(
                          existeEnOtro => {
                            if (existeEnOtro) {
                              cronogramaDto.autorizado = 'PENDIENTE';
                        
                              this.toastr.warning('El profesional ya posee otra actividad. Guardia pendiente de autorización.', undefined, {
                                timeOut: 6000,
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
      this.distribucionGuardiaService.existeTentativoEnDistribucionGuardia(cronogramaDto).subscribe(
        enGuardia => {
          if (enGuardia) {
            this.novedadPersonalService.tieneLicenciaLAO(cronogramaDto.idAsistencial).subscribe(
              tieneLAO => {
                if (tieneLAO) {
                  cronogramaDto.autorizado = 'CONFIRMADO';

                  this.toastr.success('Guardia autorizada', undefined, {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                  });

                  this.guardarCronogramaConAutorizacion(cronogramaDto);
                } else {
                  this.novedadPersonalService.tieneLicenciaCompensatorio(cronogramaDto.idAsistencial).subscribe(
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
                            timeOut: 8000,
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
          } else {
            // No en Guardia, revisar los otros 3
            this.distribucionConsultorioService.existeTentativoEnDistribucionConsultorio(cronogramaDto).subscribe(
              enConsultorio => {
                if (enConsultorio) {
                  cronogramaDto.autorizado = 'PENDIENTE';

                  this.toastr.warning('El profesional ya posee otra actividad. Guardia pendiente de autorización.', undefined, {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                  });

                  this.guardarCronogramaConAutorizacion(cronogramaDto);
                } else {
                  this.distribucionGiraService.existeTentativoEnDistribucionGira(cronogramaDto).subscribe(
                    enGira => {
                      if (enGira) {
                        cronogramaDto.autorizado = 'PENDIENTE';

                        this.toastr.warning('El profesional ya posee otra actividad. Guardia pendiente de autorización.', undefined, {
                          timeOut: 6000,
                          positionClass: 'toast-top-center',
                          progressBar: true
                        });
                        
                        this.guardarCronogramaConAutorizacion(cronogramaDto);
                      } else {
                        this.distribucionOtroService.existeTentativoEnDistribucionOtro(cronogramaDto).subscribe(
                          enOtro => {
                            if (enOtro) {
                              cronogramaDto.autorizado = 'PENDIENTE';
                        
                              this.toastr.warning(
                                'El profesional ya posee otra actividad. Guardia pendiente de autorización.',
                                undefined,
                                {
                                  timeOut: 6000,
                                  positionClass: 'toast-top-center',
                                  progressBar: true
                                }
                              );
                            } else {
                              cronogramaDto.autorizado = 'CONFIRMADO';
                        
                              this.toastr.success(
                                'Guardia autorizada',
                                undefined,
                                {
                                  timeOut: 6000,
                                  positionClass: 'toast-top-center',
                                  progressBar: true
                                }
                              );
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