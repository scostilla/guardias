import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AsistencialSelectorComponent } from 'src/app/components/configuracion/usuarios/asistencial-selector/asistencial-selector.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialDto } from 'src/app/dto/Configuracion/AsistencialDto';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { DistribucionGuardiaDto } from 'src/app/dto/personal/DistribucionGuardiaDto';
import { DistribucionConsultorioService } from 'src/app/services/personal/distribucionConsultorio.service';
import { DistribucionConsultorioDto } from 'src/app/dto/personal/DistribucionConsultorioDto';
import { DistribucionGiraService } from 'src/app/services/personal/distribucionGira.service';
import { DistribucionGiraDto } from 'src/app/dto/personal/DistribucionGiraDto';
import { DistribucionOtroService } from 'src/app/services/personal/distribucionOtro.service';
import { DistribucionOtroDto } from 'src/app/dto/personal/DistribucionOtroDto';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { ServicioService } from 'src/app/services/servicio.service';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { CapsDto } from 'src/app/dto/Configuracion/CapsDto';
import { CapsService } from 'src/app/services/Configuracion/caps.service';


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
  
  step = -1;
  cantidadHoras: number = 0;

  cargaHoraria?: number;
  idEfector?: number;
  tiposGuardiaOptions: { nombre: string }[] = [];

  horasStatus: string = '';
  horasMessage: string = '';
  horasMessageClass: string = '';

  servicios: Servicio[] = [];
  hospitales: Hospital[] = [];
  capss: CapsDto[] = [];

  isProfessionalLoaded: boolean = false;
  isButtonDisabled: boolean = true;
  

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
      fechaInicio: ['', Validators.required],
      fechaFinalizacion: ['', Validators.required],
      horaIngreso: ['', Validators.required],
      idServicio: ['', Validators.required]
    });

    this.consultorioForm = this.fb.group({
      idPersona: ['', Validators.required],
      tipoConsultorio: ['', Validators.required],
      lugar: ['', Validators.required],
      dia: ['', Validators.required],
      cantidadHoras: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinalizacion: ['', Validators.required],
      horaIngreso: ['', Validators.required],
      idServicio: ['', Validators.required]
    });

    this.giraForm = this.fb.group({
      idPersona: ['', Validators.required],
      dia: ['', Validators.required],
      cantidadHoras: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinalizacion: ['', Validators.required],
      horaIngreso: ['', Validators.required],
      puestoSalud: ['', Validators.required],
      descripcion: ['', Validators.required],
      destino: ['', Validators.required]
    });

    this.otroForm = this.fb.group({
      idPersona: ['', Validators.required],
      dia: ['', Validators.required],
      cantidadHoras: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinalizacion: ['', Validators.required],
      horaIngreso: ['', Validators.required],
      descripcion: ['', Validators.required],
      lugar: ['', Validators.required]
    });


    this.subscribeToFormChanges();
  }

  options: any[] | undefined;

  ngOnInit() {
    this.listServicios();
    this.listEfectores();
    this.listCaps();
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
  
        if (result.legajos.length > 0) {
          const legajo = result.legajos[0];
          if (legajo.udo) {
            this.idEfector = legajo.udo.id;
            this.listCaps();
          } else {
            this.idEfector = undefined;
            this.capss = [];
            this.loadTiposGuardia();
          }
            
          if (legajo.revista && legajo.revista.cargaHoraria) {
            this.cargaHoraria = legajo.revista.cargaHoraria.cantidad;
            this.isProfessionalLoaded = true;
            this.tiposGuardiaOptions = result.tiposGuardias;
          } else {
            this.cargaHoraria = undefined;
            this.isProfessionalLoaded = false;
            this.toastr.warning('El profesional seleccionado no posee una revista.', 'Advertencia', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          }
        } else {
          this.cargaHoraria = undefined;
          this.isProfessionalLoaded = false;
          this.toastr.warning('El profesional seleccionado no posee un legajo.', 'Advertencia', {
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
      } else if (totalHoras === 0) {
        this.horasMessage = 'Aún no se cargaron horas en el formulario';
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

  listServicios(): void {
    this.servicioService.list().subscribe(data => {
      console.log('Lista de servicios:', data);
      this.servicios = data;
    }, error => {
      console.log(error);
    });
  }

  listEfectores(): void {
    this.hospitalService.list().subscribe(data => {
      console.log('Lista de hospitales:', data);
      this.hospitales = data;
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

  loadTiposGuardia(): void {
    if (this.idEfector) {
      this.asistencialService.listByUdoAndTipoGuardia(this.idEfector).subscribe(data => {
        console.log('Tipos de guardia obtenidos:', data);
        this.tiposGuardiaOptions = data; // Asigna los datos obtenidos a tiposGuardiaOptions
      }, error => {
        console.log('Error al listar tipos de guardia:', error);
      });
    } else {
      this.tiposGuardiaOptions = []; // Si no hay idEfector, limpiar los tipos de guardia
    }
  }

  saveDistribuciones() {
    this.isButtonDisabled = true;

    if (this.idEfector === undefined) {
        this.toastr.error('El efector no está definido.', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
        });
        this.isButtonDisabled = false;
        return;
    }

    //Esto es para chequear si un form se inicio tiene datos obligatorios sin guardar
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

    //El uso de promesas es para poder bloquear el boton una vez realizada la accion de guardar
    const savePromises = [];

    //Guarda guardia
    if (this.guardiaForm.valid) {
        const distribucionGuardiaDto = new DistribucionGuardiaDto(
            this.guardiaForm.value.dia,
            this.guardiaForm.value.cantidadHoras,
            this.guardiaForm.value.idPersona,
            this.idEfector,
            this.guardiaForm.value.fechaInicio,
            this.guardiaForm.value.fechaFinalizacion,
            this.guardiaForm.value.horaIngreso,
            this.guardiaForm.value.tipoGuardia,
            this.guardiaForm.value.idServicio.id
        );

        savePromises.push(
            this.distribucionGuardiaService.save(distribucionGuardiaDto).toPromise()
                .then(() => this.toastr.success('Guardia guardada exitosamente.', 'Éxito', {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                }))
                .catch(() => this.toastr.error('Error al guardar la Guardia.', 'Error', {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                }))
        );
    }

    //Guarda consultorio
    if (this.consultorioForm.valid) {
        const distribucionConsultorioDto = new DistribucionConsultorioDto(
            this.consultorioForm.value.dia,
            this.consultorioForm.value.cantidadHoras,
            this.consultorioForm.value.idPersona,
            this.idEfector,
            this.consultorioForm.value.fechaInicio,
            this.consultorioForm.value.fechaFinalizacion,
            this.consultorioForm.value.horaIngreso,
            this.consultorioForm.value.idServicio.id,
            this.consultorioForm.value.tipoConsultorio,
            this.consultorioForm.value.lugar
        );

        savePromises.push(
            this.distribucionConsultorioService.save(distribucionConsultorioDto).toPromise()
                .then(() => this.toastr.success('Consultorio guardado exitosamente.', 'Éxito', {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                }))
                .catch(() => this.toastr.error('Error al guardar el Consultorio.', 'Error', {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                }))
        );
    }

    //Guarda gira medica
    if (this.giraForm.valid) {
        const distribucionGiraDto = new DistribucionGiraDto(
            this.giraForm.value.dia,
            this.giraForm.value.cantidadHoras,
            this.giraForm.value.idPersona,
            this.idEfector,
            this.giraForm.value.fechaInicio,
            this.giraForm.value.fechaFinalizacion,
            this.giraForm.value.horaIngreso,
            this.giraForm.value.puestoSalud,
            this.giraForm.value.descripcion,
            this.giraForm.value.destino
        );

        savePromises.push(
            this.distribucionGiraService.save(distribucionGiraDto).toPromise()
                .then(() => this.toastr.success('Gira médica guardada exitosamente.', 'Éxito', {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                }))
                .catch(() => this.toastr.error('Error al guardar la Gira médica.', 'Error', {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                }))
        );
    }

    //Guarda Otras actividades
    if (this.otroForm.valid) {
        const distribucionOtroDto = new DistribucionOtroDto(
            this.otroForm.value.dia,
            this.otroForm.value.cantidadHoras,
            this.otroForm.value.idPersona,
            this.idEfector,
            this.otroForm.value.fechaInicio,
            this.otroForm.value.fechaFinalizacion,
            this.otroForm.value.horaIngreso,
            this.otroForm.value.descripcion,
            this.otroForm.value.lugar
        );

        savePromises.push(
            this.distribucionOtroService.save(distribucionOtroDto).toPromise()
                .then(() => this.toastr.success('Otra actividad guardada exitosamente.', 'Éxito', {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                }))
                .catch(() => this.toastr.error('Error al guardar otra actividad.', 'Error', {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                }))
        );
    }

    // Ejecuta todas las promesas
    Promise.all(savePromises)
        .then(() => {
            this.router.navigate(['/personal']);
        })
        .catch(() => {
            // Manejo de errores general
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

  nextStep(): void {
    this.step = (this.step + 1) % 4;
  }

  prevStep(): void {
    this.step = (this.step - 1 + 4) % 4;
  }

  setStep(index: number) {
    this.step = index;
  }

  get isPanelEnabled(): boolean {
    return this.isProfessionalLoaded;
  }

  get isPanel0Expanded(): boolean {
    return this.isProfessionalLoaded && this.step === 0;
  }
  
  get isPanel1Expanded(): boolean {
    return this.isProfessionalLoaded && this.step === 1;
  }
  
  get isPanel2Expanded(): boolean {
    return this.isProfessionalLoaded && this.step === 2;
  }
  
  get isPanel3Expanded(): boolean {
    return this.isProfessionalLoaded && this.step === 3;
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

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigate(['/personal']);
  }

}
