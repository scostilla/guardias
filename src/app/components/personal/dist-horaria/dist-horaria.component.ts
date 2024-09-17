import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DistHorariaGuardiaComponent } from '../../actividades/dist-horaria-guardia/dist-horaria-guardia.component';
import { DistHorariaConsComponent } from '../../actividades/dist-horaria-cons/dist-horaria-cons.component';
import { DistHorariaGirasComponent } from '../../actividades/dist-horaria-giras/dist-horaria-giras.component';
import { DistHorariaOtrasComponent } from '../../actividades/dist-horaria-otras/dist-horaria-otras.component';
import { AsistencialSelectorComponent } from 'src/app/components/configuracion/usuarios/asistencial-selector/asistencial-selector.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { DistribucionGuardia } from 'src/app/models/personal/DistribucionGuardia';
import { DistribucionGuardiaDto } from 'src/app/dto/personal/DistribucionGuardiaDto';
import { DistribucionConsultorioService } from 'src/app/services/personal/distribucionConsultorio.service';
import { DistribucionConsultorio } from 'src/app/models/personal/DistribucionConsultorio';
import { DistribucionConsultorioDto } from 'src/app/dto/personal/DistribucionConsultorioDto';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { ServicioService } from 'src/app/services/servicio.service';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { Revista } from 'src/app/models/Configuracion/Revista';
import * as moment from 'moment';


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
  step = 0;
  cantidadHoras: number = 0;
  horasStatus: string = '';

  cargaHoraria?: number;
  idEfector?: number;
  tiposGuardiaOptions: { id: number, nombre: string }[] = [];

  isProfessionalLoaded: boolean = false;

  horasMessage: string = '';
  horasMessageClass: string = '';


  servicios: Servicio[] = [];
  hospitales: Hospital[] = [];

  hospitaless: string[] = ['DN. PABLO SORIA'];
  profesional: string[] = ['FIGUEROA ELIO', 'ARRAYA PEDRO ADEMIR', 'MORALES RICARDO', 'ALFARO FIDEL', 'MARTINEZ YANINA VANESA G.'];
  guardia: string[] = ['Cargo', 'Agrupacion'];
  dia: string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  cons: string[] = ['Consultorio externo', 'Comisión'];
  turno: string[] = ['Mañana', 'Tarde'];

  selectedService: string = 'Cargo';
  selectedGuard: string = '';
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
    private servicioService: ServicioService,
    private hospitalService: HospitalService,
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

    this.subscribeToFormChanges();
  }

  options: any[] | undefined;

  ngOnInit() {
    this.listServicios();
    this.listEfectores();
  }

  private subscribeToFormChanges(): void {
    this.guardiaForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.consultorioForm.valueChanges.subscribe(() => this.updateHorasStatus());
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
          } else {
            this.idEfector = undefined;
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
  const totalHoras = guardiaHoras + consultorioHoras;

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
      this.isButtonDisabled = false;
    }
  } else {
    this.horasMessage = '';
    this.horasMessageClass = '';
    this.isButtonDisabled = true;
  }

  this.isButtonDisabled = this.isButtonDisabled || !this.guardiaForm.valid || !this.consultorioForm.valid;
}

  updateIdPersona(id: string): void {
    console.log('Actualizando idPersona:', id);
    this.guardiaForm.patchValue({ idPersona: id });
    this.consultorioForm.patchValue({ idPersona: id });
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

  saveAll() {
    if (this.guardiaForm.valid && this.consultorioForm.valid) {
      if (this.isButtonDisabled) {
        return;
      }
  
      this.isButtonDisabled = true;
  
      const dataGuardia = this.guardiaForm.value;
      const dataConsultorio = this.consultorioForm.value;
  
      if (this.idEfector === undefined) {
        this.toastr.error('El ID del efector no está definido.', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.isButtonDisabled = false;
        return;
      }
  
      const distribucionGuardiaDto = new DistribucionGuardiaDto(
        dataGuardia.dia,
        dataGuardia.cantidadHoras,
        dataGuardia.idPersona,
        this.idEfector,
        dataGuardia.fechaInicio,
        dataGuardia.fechaFinalizacion,
        dataGuardia.horaIngreso,
        dataGuardia.tipoGuardia,
        dataGuardia.idServicio.id
      );
  
      const distribucionConsultorioDto = new DistribucionConsultorioDto(
        dataConsultorio.dia,
        dataConsultorio.cantidadHoras,
        dataConsultorio.idPersona,
        this.idEfector,
        dataConsultorio.fechaInicio,
        dataConsultorio.fechaFinalizacion,
        dataConsultorio.horaIngreso,
        dataGuardia.idServicio.id,
        dataConsultorio.tipoConsultorio,
        dataConsultorio.lugar
      );
  
      this.distribucionGuardiaService.save(distribucionGuardiaDto).subscribe(
        result => {
          console.log('Resultado al guardar guardia:', result);
          this.toastr.success('Guardia guardada exitosamente.', 'Éxito', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
  
          this.distribucionConsultorioService.save(distribucionConsultorioDto).subscribe(
            result => {
              console.log('Resultado al guardar consultorio:', result);
              this.toastr.success('Consultorio guardado exitosamente.', 'Éxito', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
  
              this.router.navigate(['/personal']);
              this.isButtonDisabled = false;
            },
            error => {
              console.error('Error al guardar consultorio:', error);
              this.toastr.error('Ocurrió un error al guardar el consultorio.', 'Error', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
              this.isButtonDisabled = false;
            }
          );
        },
        error => {
          console.error('Error al guardar guardia:', error);
          this.toastr.error('Ocurrió un error al guardar la guardia.', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.isButtonDisabled = false;
        }
      );
    } else {
      this.toastr.warning('Por favor, completa todos los campos obligatorios.', 'Advertencia', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
    }
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

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigate(['/personal']);
  }

  openDistGuardia() {
    this.dialogReg.open(DistHorariaGuardiaComponent, {
      width: '600px',
      disableClose: true,
    });
  }

  openDistCons() {
    this.dialogReg.open(DistHorariaConsComponent, {
      width: '600px',
      disableClose: true,
    });
  }

  openDistGira() {
    this.dialogReg.open(DistHorariaGirasComponent, {
      width: '600px',
      disableClose: true,
    });
  }

  openDistOtra() {
    this.dialogReg.open(DistHorariaOtrasComponent, {
      width: '600px',
      disableClose: true,
    });
  }

}
