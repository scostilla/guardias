import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AsistencialSelectorComponent } from 'src/app/components/configuracion/usuarios/asistencial-selector/asistencial-selector.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { DistribucionGuardia } from 'src/app/models/personal/DistribucionGuardia';
import { DistribucionGuardiaDto } from 'src/app/dto/personal/DistribucionGuardiaDto';
import { DistribucionConsultorioService } from 'src/app/services/personal/distribucionConsultorio.service';
import { DistribucionConsultorioDto } from 'src/app/dto/personal/DistribucionConsultorioDto';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { ServicioService } from 'src/app/services/servicio.service';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { CapsDto } from 'src/app/dto/Configuracion/CapsDto';
import { DistribucionGiraService } from 'src/app/services/personal/distribucionGira.service';
import { DistribucionOtroService } from 'src/app/services/personal/distribucionOtro.service';
import { CapsService } from 'src/app/services/Configuracion/caps.service';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import * as moment from 'moment';
import { DistribucionGiraDto } from 'src/app/dto/personal/DistribucionGiraDto';
import { DistribucionOtroDto } from 'src/app/dto/personal/DistribucionOtroDto';
import { DistribucionGira } from 'src/app/models/personal/DistribucionGira';
import { DistribucionOtro } from 'src/app/models/personal/DistribucionOtro';
import { DistribucionConsultorio } from 'src/app/models/personal/DistribucionConsultorio';



@Component({
  selector: 'app-dist-horaria',
  templateUrl: './dist-horaria.component.html',
  styleUrls: ['./dist-horaria.component.css'],
})
export class DistHorariaComponent {

  inputValue: string = '';
  selectedAsistencial?: Asistencial;
  guardiaForm!: FormGroup;
  consultorioForm!: FormGroup;
  giraForm!: FormGroup;
  otroForm!: FormGroup;
  vigenciaForm!: FormGroup;
  
  step = -1;
  cantidadHoras: number = 0;
  minDate!: Date;

  cargaHoraria?: number;
  idEfector?: number;
  tiposGuardiaOptions: { nombre: string }[] = [];
  meses: { nombre: string; fecha: moment.Moment; }[] = [];

  horasStatus: string = '';
  horasMessage: string = '';
  horasMessageClass: string = '';

  servicios: Servicio[] = [];
  hospitales: Hospital[] = [];
  capss: CapsDto[] = [];

  private distribucionesConsultorio: DistribucionConsultorio[] = [];
  private distribucionesGuardia: DistribucionGuardia[] = [];
  private distribucionesGira: DistribucionGira[] = [];
  private distribucionesOtro: DistribucionOtro[] = [];

  isProfessionalLoaded: boolean = false;
  isButtonDisabled: boolean = true;
  isPanelsEnabled: boolean = true;

  options: any[] | undefined;
  

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public dialogReg: MatDialog,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private distribucionGuardiaService: DistribucionGuardiaService,
    private distribucionConsultorioService: DistribucionConsultorioService,
    private distribucionGiraService: DistribucionGiraService,
    private distribucionOtroService: DistribucionOtroService,
    private servicioService: ServicioService,
    private hospitalService: HospitalService,
    private capsService: CapsService,
    private asistencialService: AsistencialService,
    private fb: FormBuilder
  ) {
    this.guardiaForm = this.fb.group({
      idPersona: ['', Validators.required],
      tipoGuardia: ['', Validators.required],
      dia: ['', Validators.required],
      cantidadHoras: ['', Validators.required],
      horaIngreso: ['', Validators.required],
      idServicio: ['', Validators.required]
    });

    this.consultorioForm = this.fb.group({
      idPersona: ['', Validators.required],
      tipoConsultorio: ['', Validators.required],
      dia: ['', Validators.required],
      cantidadHoras: ['', Validators.required],
      horaIngreso: ['', Validators.required],
      idServicio: ['', Validators.required]
    });

    this.giraForm = this.fb.group({
      idPersona: ['', Validators.required],
      dia: ['', Validators.required],
      cantidadHoras: ['', Validators.required],
      horaIngreso: ['', Validators.required],
      puestoSalud: ['', Validators.required],
      descripcion: ['', Validators.required],
      destino: ['', Validators.required]
    });

    this.otroForm = this.fb.group({
      idPersona: ['', Validators.required],
      dia: ['', Validators.required],
      cantidadHoras: ['', Validators.required],
      horaIngreso: ['', Validators.required],
      descripcion: ['', Validators.required],
      lugar: ['', Validators.required]
    });

    this.vigenciaForm = this.fb.group({
      mesVigencia: [null, Validators.required],
      fechaInicio: [{ value: null, disabled: true }],
      fechaFinalizacion: [{ value: null, disabled: true }]
    });

    this.minDate = new Date();
    this.subscribeToFormChanges();
  }

  ngOnInit() {
    this.listServicios();
    this.listCaps();
    this.generarMeses();

    this.distribucionConsultorioService.list().subscribe(data => {
      this.distribucionesConsultorio = data;
    });
    
    this.distribucionGuardiaService.list().subscribe(data => {
      this.distribucionesGuardia = data;
    });
    
    this.distribucionGiraService.list().subscribe(data => {
      this.distribucionesGira = data;
    });
    
    this.distribucionOtroService.list().subscribe(data => {
      this.distribucionesOtro = data;
    });
  
  }

  private subscribeToFormChanges(): void {
    this.guardiaForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.consultorioForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.giraForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.otroForm.valueChanges.subscribe(() => this.updateHorasStatus());
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
        this.updateIdPersona(result.id);
  
        // Resetear el select del mes de vigencia
        this.vigenciaForm.patchValue({ mesVigencia: null });
  
        const legajosActivos = result.legajos.filter((legajo: { activo: boolean; }) => legajo.activo === true);
        const ultimoLegajoActivo = legajosActivos.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id)[0];
  
        if (ultimoLegajoActivo) {
          if (ultimoLegajoActivo.udo) {
            this.idEfector = ultimoLegajoActivo.udo.id;
            this.listCaps();
          } else {
            this.idEfector = undefined;
            this.capss = [];
            this.listTiposGuardia();
          }
          
          if (ultimoLegajoActivo.revista && ultimoLegajoActivo.revista.cargaHoraria) {
            this.cargaHoraria = ultimoLegajoActivo.revista.cargaHoraria.cantidad;
            this.isProfessionalLoaded = true;
            this.tiposGuardiaOptions = result.tiposGuardias;
          } else {
            this.cargaHoraria = undefined;
            this.isProfessionalLoaded = false;
            this.toastr.warning('El profesional seleccionado no posee una revista.', 'Aviso', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          }
        } else {
          this.cargaHoraria = undefined;
          this.isProfessionalLoaded = false;
          this.toastr.warning('El profesional seleccionado no posee un legajo.', 'Aviso', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
  
        console.log('Asistencial recibido en el componente principal:', this.selectedAsistencial);
        console.log('ID Efector:', this.idEfector);
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
    
    
  private updateHorasStatus(): void {
    const guardiaHoras = Number(this.guardiaForm.get('cantidadHoras')?.value ?? 0);
    const consultorioHoras = Number(this.consultorioForm.get('cantidadHoras')?.value ?? 0);
    const giraHoras = Number(this.giraForm.get('cantidadHoras')?.value ?? 0);
    const otroHoras = Number(this.otroForm.get('cantidadHoras')?.value ?? 0);
    const totalHoras = guardiaHoras + consultorioHoras + giraHoras + otroHoras;
  
    if (this.cargaHoraria !== undefined) {
      if (totalHoras > this.cargaHoraria) {
        this.horasMessage = 'Has superado el total de horas posibles';
        this.horasMessageClass = 'error-message';
        this.isButtonDisabled = true;
      } else if (totalHoras < this.cargaHoraria) {
        this.horasMessage = `Total de horas cargadas: ${totalHoras}. Debes alcanzar ${this.cargaHoraria} hs entre todos los formularios.`;
        this.horasMessageClass = 'pending-message';
        this.isButtonDisabled = true;
      } else {
        this.horasMessage = `Has cargado un total de ${totalHoras} hs`;
        this.horasMessageClass = 'success-message';
        this.isButtonDisabled = !this.guardiaForm.valid && !this.consultorioForm.valid && !this.giraForm.valid && !this.otroForm.valid;
      }
    } else {
      this.horasMessage = '';
      this.horasMessageClass = '';
      this.isButtonDisabled = !this.guardiaForm.valid && !this.consultorioForm.valid  && !this.giraForm.valid && !this.otroForm.valid;
    }
  }

  updateIdPersona(id: string): void {
    console.log('Actualizando idPersona:', id);
    this.guardiaForm.patchValue({ idPersona: id });
    this.consultorioForm.patchValue({ idPersona: id });
    this.giraForm.patchValue({ idPersona: id });
    this.otroForm.patchValue({ idPersona: id });
  }

  updateFechas() {
    const mesVigencia = this.vigenciaForm.get('mesVigencia')?.value;
    const idPersonaSeleccionado = this.guardiaForm.get('idPersona')?.value;
  
    // Verificación de datos
    if (!mesVigencia) {
      console.warn('Mes de vigencia no está definido.');
      return;
    }
    if (!idPersonaSeleccionado) {
      console.warn('ID de persona no está definido.');
      return;
    }
  
    const fechaInicio = moment(mesVigencia).startOf('month').toDate();
    const fechaFinalizacion = moment(mesVigencia).endOf('month').toDate();
  
    this.vigenciaForm.patchValue({
      fechaInicio: fechaInicio,
      fechaFinalizacion: fechaFinalizacion
    });
  
    // Obtener mes y año de vigencia
    const mesesParaVerificar = [];
    let inicio = moment().add(1, 'month').startOf('month'); // Comienza desde el siguiente mes
    const fin = moment(mesVigencia).endOf('month');
  
    while (inicio.isSameOrBefore(fin, 'month')) {
      mesesParaVerificar.push({ mes: inicio.month(), año: inicio.year() });
      inicio.add(1, 'month');
    }
  
    // Verificar si ya hay registros en cada uno de los meses calculados
    let existenRegistros = false;
    for (const { mes, año } of mesesParaVerificar) {
      if (
        this.verificarRegistros(this.distribucionesConsultorio, mes, año, idPersonaSeleccionado) ||
        this.verificarRegistros(this.distribucionesGuardia, mes, año, idPersonaSeleccionado) ||
        this.verificarRegistros(this.distribucionesGira, mes, año, idPersonaSeleccionado) ||
        this.verificarRegistros(this.distribucionesOtro, mes, año, idPersonaSeleccionado)
      ) {
        existenRegistros = true;
        break; // Si se encuentra al menos un registro, salir del bucle
      }
    }
  
    if (existenRegistros) {
      this.toastr.warning('Ya existen registros para uno o más de los meses seleccionados.', 'Advertencia', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.isPanelsEnabled = false; // Deshabilitar los paneles
    } else {
      this.isPanelsEnabled = true; // Habilitar los paneles si no existen registros
    }
  }
        
  private verificarRegistros(distribuciones: any[], mes: number, año: number, idPersona: number): boolean {
    return distribuciones.some(distribucion => {
      const fechaDistribucionInicio = new Date(distribucion.fechaInicio);
      const fechaDistribucionFin = new Date(distribucion.fechaFinalizacion);
      const activo = distribucion.activo; // Verifica que 'activo' es correcto
      const personaId = distribucion.persona.id; // Verifica que 'persona' tiene la propiedad 'id'
  
      // Log para depuración
      console.log('Verificando distribución:', {
        activo,
        personaId,
        idPersona,
        fechaDistribucionInicio,
        fechaDistribucionFin,
        mes,
        año
      });
  
      return (
        activo &&
        personaId === idPersona &&
        // Verifica que el mes y el año coincidan tanto en inicio como en fin
        ((fechaDistribucionInicio.getMonth() === mes && fechaDistribucionInicio.getFullYear() === año) ||
        (fechaDistribucionFin.getMonth() === mes && fechaDistribucionFin.getFullYear() === año))
      );
    });
  }
    
  listServicios(): void {
    this.servicioService.list().subscribe(data => {
      console.log('Lista de servicios:', data);
      this.servicios = data;
    }, error => {
      console.log(error);
    });
  }

  listCaps(): void {
    if (this.idEfector) {
      this.hospitalService.listActiveCapsByHospitalId(this.idEfector).subscribe(data => {
        console.log('Caps activos para el efector:', data);
        this.capss = data; // Asigna los datos obtenidos a capss
      }, error => {
        console.log('Error al listar caps activos:', error);
      });
    } else {
      this.capss = []; // Si no hay idEfector, limpiar los caps
    }
  }

  listTiposGuardia(): void {
    if (this.idEfector) {
      this.asistencialService.listByUdoAndTipoGuardia(this.idEfector).subscribe(data => {
        console.log('Tipos de guardia obtenidos:', data);
        this.tiposGuardiaOptions = data;
      }, error => {
        console.log('Error al listar tipos de guardia:', error);
      });
    } else {
      this.tiposGuardiaOptions = [];
    }
  }

  //Permite el select mes de vigencia cree la ultima fecha del mes elegido
  private generarMeses(): void {
    const hoy = new Date();
    this.meses = [];
    
    // Comienza desde el mes siguiente al actual
    for (let i = 1; i <= 6; i++) {
        const mes = moment(new Date(hoy.getFullYear(), hoy.getMonth() + i, 1));
        
        const fechaInicio = mes.startOf('month').toDate();
        const fechaFinalizacion = moment(mes).endOf('month');
  
        const mesNombreCapitalizado = mes.format('MMMM').charAt(0).toUpperCase() + mes.format('MMMM').slice(1);
    
        this.meses.push({ nombre: mesNombreCapitalizado, fecha: fechaFinalizacion });
    }
}

  // Verifica los campos en cada form para colocar su estado (en proceso o finalizado)
  isFormStarted(form: FormGroup): boolean {
    return form.dirty;
  }
  
  isFormComplete(form: FormGroup): boolean {
    return this.isFormStarted(form) && form.valid;
  }
  
  hasIncompleteFields(form: FormGroup): boolean {
    return this.isFormStarted(form) && !form.valid;
  }

  cerrarPanel() {
    this.step = -1;
  }

  saveDistribuciones() {
    this.isButtonDisabled = true;

    // Obtener fechas de inicio y finalización para cada formulario
    const mesVigencia = this.vigenciaForm.get('mesVigencia')?.value;

    if (this.idEfector === undefined) {
        this.toastr.error('El profesional no esta definido o no posee un legajo.', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
        });
        this.isButtonDisabled = false;
        return;
    }

    console.log('Datos a guardar:', {
        guardia: this.guardiaForm.value,
        consultorio: this.consultorioForm.value,
        gira: this.giraForm.value,
        otro: this.otroForm.value,
    });

    const formChecks = [
        { form: this.guardiaForm, name: 'Guardias' },
        { form: this.consultorioForm, name: 'Consultorio' },
        { form: this.giraForm, name: 'Giras médicas' },
        { form: this.otroForm, name: 'Otras actividades' }
    ];

    for (const { form, name } of formChecks) {
        if (form.dirty && !form.valid) {
            this.toastr.warning(`Faltan datos obligatorios para el panel ${name}.`, 'Advertencia', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
            });
            this.isButtonDisabled = false;
            return;
        }
    }

    const savePromises = [];
    const errorMessages: string[] = [];

    // Calcula meses para cada distribución
    const guardiaMeses = this.calcularMeses(mesVigencia);
    const consultorioMeses = this.calcularMeses(mesVigencia);
    const giraMeses = this.calcularMeses(mesVigencia);
    const otroMeses = this.calcularMeses(mesVigencia);

    // Guarda guardia
    if (this.guardiaForm.valid) {
        for (const mes of guardiaMeses) {
            const distribucionGuardiaDto = new DistribucionGuardiaDto(
                this.guardiaForm.value.dia,
                this.guardiaForm.value.cantidadHoras,
                this.guardiaForm.value.idPersona,
                this.idEfector,
                mes.fechaInicio,
                mes.fechaFinalizacion,
                this.guardiaForm.value.horaIngreso,
                this.guardiaForm.value.tipoGuardia,
                this.guardiaForm.value.idServicio.id
            );

            console.log('Guardia a guardar:', distribucionGuardiaDto);

            savePromises.push(
              this.distribucionGuardiaService.save(distribucionGuardiaDto).toPromise()
                  .catch(() => {
                      errorMessages.push(`Guardia en ${mes.mes}: ${distribucionGuardiaDto.dia}`);
                  })
          );
      }
    }

    // Guarda consultorio
    if (this.consultorioForm.valid) {
        for (const mes of consultorioMeses) {
            const distribucionConsultorioDto = new DistribucionConsultorioDto(
                this.consultorioForm.value.dia,
                this.consultorioForm.value.cantidadHoras,
                this.consultorioForm.value.idPersona,
                this.idEfector,
                mes.fechaInicio,
                mes.fechaFinalizacion,
                this.consultorioForm.value.horaIngreso,
                this.consultorioForm.value.idServicio.id,
                this.consultorioForm.value.tipoConsultorio
            );

            savePromises.push(
              this.distribucionConsultorioService.save(distribucionConsultorioDto).toPromise()
                  .catch(() => {
                      errorMessages.push(`Guardia en ${mes.mes}: ${distribucionConsultorioDto.dia}`);
                  })
          );
      }
    }

    // Guarda gira médica
    if (this.giraForm.valid) {
        for (const mes of giraMeses) {
            const distribucionGiraDto = new DistribucionGiraDto(
                this.giraForm.value.dia,
                this.giraForm.value.cantidadHoras,
                this.giraForm.value.idPersona,
                this.idEfector,
                mes.fechaInicio,
                mes.fechaFinalizacion,
                this.giraForm.value.horaIngreso,
                this.giraForm.value.puestoSalud,
                this.giraForm.value.descripcion,
                this.giraForm.value.destino
            );

            savePromises.push(
              this.distribucionGiraService.save(distribucionGiraDto).toPromise()
                  .catch(() => {
                      errorMessages.push(`Guardia en ${mes.mes}: ${distribucionGiraDto.dia}`);
                  })
          );
      }
    }

    // Guarda otras actividades
    if (this.otroForm.valid) {
        for (const mes of otroMeses) {
            const distribucionOtroDto = new DistribucionOtroDto(
                this.otroForm.value.dia,
                this.otroForm.value.cantidadHoras,
                this.otroForm.value.idPersona,
                this.idEfector,
                mes.fechaInicio,
                mes.fechaFinalizacion,
                this.otroForm.value.horaIngreso,
                this.otroForm.value.descripcion,
                this.otroForm.value.lugar
            );

            savePromises.push(
              this.distribucionOtroService.save(distribucionOtroDto).toPromise()
                  .catch(() => {
                      errorMessages.push(`Guardia en ${mes.mes}: ${distribucionOtroDto.dia}`);
                  })
          );
      }
    }

    // Envia los datos cargados para guardar
    Promise.all(savePromises)
        .then(() => {
            // Mostrar mensaje de éxito
            this.toastr.success('Se ha guardado exitosamente la distribución horaria.', 'Éxito', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
            });

            // Si hubo errores, mostrar detalle
            if (errorMessages.length > 0) {
                this.toastr.error(`No se pudo guardar las siguientes distribuciones: ${errorMessages.join(', ')}`, 'Error', {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                });
            }

            this.router.navigate(['/personal']);
        })
        .catch(() => {
            this.toastr.error('Ocurrió un error al guardar uno o más formularios.', 'Error', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
            });
        })
        .finally(() => {
            this.isButtonDisabled = false;
        });
  }

// Función para calcular los meses de un rango de fechas
calcularMeses(mesVigencia: string): Array<{ mes: string, fechaInicio: Date, fechaFinalizacion: Date }> {
  const meses: Array<{ mes: string, fechaInicio: Date, fechaFinalizacion: Date }> = [];
  const mesActual = moment(); // Fecha actual
  const mesVigente = moment(mesVigencia); // Mes de vigencia

  let inicio = mesActual.clone().add(1, 'month'); // Comienza desde el siguiente mes
  const fin = mesVigente; // Hasta el mes de vigencia

  while (inicio.isSameOrBefore(fin, 'month')) {
      const mesNombreCapitalizado = inicio.format('MMMM').charAt(0).toUpperCase() + inicio.format('MMMM').slice(1);
      
      // Asegurarse de que la fecha de finalización sea el último día del mes
      const fechaFinalizacion = inicio.endOf('month').startOf('day').toDate(); 

      meses.push({
          mes: mesNombreCapitalizado,
          fechaInicio: inicio.startOf('month').toDate(),
          fechaFinalizacion: fechaFinalizacion,
      });

      inicio.add(1, 'month'); // Mueve al siguiente mes
  }

  return meses;
}

  nextStep(): void {
    this.step = (this.step + 1) % 4;
  }

  prevStep(): void {
    this.step = (this.step - 1 + 4) % 4;
  }

  setStep(index: number) {
    this.step = index;
  }

get isMesVigenciaSelected(): boolean {
  return !!this.vigenciaForm.get('mesVigencia')?.value;
}

get isPanelEnabled(): boolean {
  return this.isProfessionalLoaded && this.isMesVigenciaSelected && this.isPanelsEnabled;
}

get isPanel0Expanded(): boolean {
  return this.isPanelEnabled && this.step === 0;
}

get isPanel1Expanded(): boolean {
  return this.isPanelEnabled && this.step === 1;
}

get isPanel2Expanded(): boolean {
  return this.isPanelEnabled && this.step === 2;
}

get isPanel3Expanded(): boolean {
  return this.isPanelEnabled && this.step === 3;
}

  compareServicio(s1: Servicio, s2: Servicio): boolean {
    return s1 && s2 ? s1.id === s2.id : s1 === s2;
  }

  compareHospital(h1: Hospital, h2: Hospital): boolean {
    return h1 && h2 ? h1.id === h2.id : h1 === h2;
  }

  compareAsistencial(a1: Asistencial, a2: Asistencial): boolean {
    return a1 && a2 ? a1.id === a2.id : a1 === a2;
  }

  compareCaps(c1: Hospital, c2: Hospital): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  limpiarGuardia() {
    this.guardiaForm.reset();
  }

  limpiarConsultorio() {
    this.consultorioForm.reset();
  }

  limpiarGira() {
    this.giraForm.reset();
  }

  limpiarOtro() {
    this.otroForm.reset();
  }

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigate(['/personal']);
  }

}