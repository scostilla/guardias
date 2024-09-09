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
import { DistribucionConsultorioService } from 'src/app/services/personal/distribucionConsultorio.service';
import { DistribucionConsultorio } from 'src/app/models/personal/DistribucionConsultorio';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { ServicioService } from 'src/app/services/servicio.service';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';


@Component({
  selector: 'app-dist-horaria',
  templateUrl: './dist-horaria.component.html',
  styleUrls: ['./dist-horaria.component.css'],
})
export class DistHorariaComponent {

  inputValue: string = '';
  selectedAsistencial?: Asistencial;
  DistribucionForm!: FormGroup;
  step = 0;
  cantidadHoras: number = 0;
  horasStatus: string = '';

  isProfessionalLoaded: boolean = false;

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
    this.DistribucionForm = this.fb.group({
      profesional: ['', Validators.required],
      tipoGuardia: ['', Validators.required],
      dia: ['', Validators.required],
      cantidadHoras: ['', [Validators.required, Validators.min(0)]],
      efectorGuardia: ['', Validators.required],
      fechaInicioGuardia: ['', Validators.required],
      fechaFinalizacionGuardia: ['', Validators.required],
      horaIngresoGuardia: ['', Validators.required],
      servicioGuardia: ['', Validators.required],

      // Campos para DistribucionConsultorio
      tipoConsultorio: ['', Validators.required],
      lugar: ['', Validators.required],
      cantidadHorasConsultorio: ['', [Validators.required, Validators.min(0)]],
      efectorConsultorio: ['', Validators.required],
      fechaInicioConsultorio: ['', Validators.required],
      fechaFinalizacionConsultorio: ['', Validators.required],
      horaIngresoConsultorio: ['', Validators.required],
      servicioConsultorio: ['', Validators.required]
    });
  }

  options: any[] | undefined;

  ngOnInit() {
    this.updateHorasStatus();
    this.DistribucionForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.listServicios();
    this.listEfectores();
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

  updateHorasStatus() {
    const horasGuardia = this.DistribucionForm.get('cantidadHoras')?.value || 0;
    const horasConsultorio = this.DistribucionForm.get('cantidadHorasConsultorio')?.value || 0;
    const totalHoras = horasGuardia + horasConsultorio;

    if (!this.isProfessionalLoaded) {
      this.horasStatus = 'Por favor, selecciona un profesional antes de continuar.';
      this.isButtonDisabled = true;
    } else if (this.DistribucionForm.invalid) {
      this.horasStatus = 'Por favor, completa todos los campos obligatorios.';
      this.isButtonDisabled = true;
    } else if (totalHoras > 40) {
      this.horasStatus = 'Se ha superado el número de horas posibles. Por favor, modifica los datos para que no sea mayor a 40 hs.';
      this.isButtonDisabled = true;
    } else {
      this.horasStatus = `Has ingresado ${totalHoras} de un total de 40.`;
      this.isButtonDisabled = false;
    }
  }

  saveDistribucion() {
    if (this.DistribucionForm.valid) {
      if (!this.selectedAsistencial) {
        this.toastr.error('Por favor, selecciona un profesional', 'Error');
        return;
      }
  
      const distribucionGuardia: DistribucionGuardia = {
        dia: this.DistribucionForm.get('dia')?.value,
        cantidadHoras: this.DistribucionForm.get('cantidadHoras')?.value,
        activo: true,
        persona: this.selectedAsistencial, // Incluye el objeto `persona` aquí
        efector: this.DistribucionForm.get('efectorGuardia')?.value,
        fechaInicio: this.DistribucionForm.get('fechaInicioGuardia')?.value,
        fechaFinalizacion: this.DistribucionForm.get('fechaFinalizacionGuardia')?.value,
        horaIngreso: this.DistribucionForm.get('horaIngresoGuardia')?.value,
        tipoGuardia: this.DistribucionForm.get('tipoGuardia')?.value,
        servicio: this.DistribucionForm.get('servicioGuardia')?.value,
      };
  
      const distribucionConsultorio: DistribucionConsultorio = {
        dia: this.DistribucionForm.get('dia')?.value,
        cantidadHoras: this.DistribucionForm.get('cantidadHorasConsultorio')?.value,
        activo: true,
        persona: this.selectedAsistencial, // Incluye el objeto `persona` aquí
        efector: this.DistribucionForm.get('efectorConsultorio')?.value,
        fechaInicio: this.DistribucionForm.get('fechaInicioConsultorio')?.value,
        fechaFinalizacion: this.DistribucionForm.get('fechaFinalizacionConsultorio')?.value,
        horaIngreso: this.DistribucionForm.get('horaIngresoConsultorio')?.value,
        tipoConsultorio: this.DistribucionForm.get('tipoConsultorio')?.value,
        lugar: this.DistribucionForm.get('lugar')?.value,
        servicio: this.DistribucionForm.get('servicioConsultorio')?.value,
      };
  
      this.distribucionGuardiaService.save(distribucionGuardia).subscribe(
        () => {
          this.distribucionConsultorioService.save(distribucionConsultorio).subscribe(
            () => {
              this.toastr.success('Distribución guardada correctamente', 'Éxito');
              this.router.navigate(['/personal']);
            },
            (error) => {
              this.toastr.error('Error al guardar la distribución del consultorio', 'Error');
              console.error(error);
            }
          );
        },
        (error) => {
          this.toastr.error('Error al guardar la distribución de la guardia', 'Error');
          console.error(error);
        }
      );
    } else {
      this.toastr.error('Por favor, completa todos los campos correctamente', 'Error');
    }
  }


  get isFormValidAndHorasValid(): boolean {
    const horas = this.DistribucionForm.get('cantidadHoras')?.value;
    const profesional = this.DistribucionForm.get('profesional')?.value;
    const horasConsultorio = this.DistribucionForm.get('cantidadHorasConsultorio')?.value;
    const totalHoras = (horas || 0) + (horasConsultorio || 0);
  
    return this.DistribucionForm.valid && profesional && totalHoras <= 40;
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

  openAsistencialDialog(): void {
    const dialogRef = this.dialog.open(AsistencialSelectorComponent, {
      width: '800px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedAsistencial = result;
        this.inputValue = `${result.apellido} ${result.nombre}`;
        this.DistribucionForm.patchValue({ 
          profesional: this.inputValue 
        });
        this.isProfessionalLoaded = true;
  
        console.log('Asistencial recibido en el componente principal:', this.selectedAsistencial);
      }
    });
  }
  
  compareServicio(p1: Servicio, p2: Servicio): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareEfector(e1: Hospital, e2: Hospital): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
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
