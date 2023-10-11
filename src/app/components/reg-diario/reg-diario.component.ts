import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ProfessionalDataServiceService } from 'src/app/services/ProfessionalDataService/Professional-data-service.service';
import Especialidad from 'src/server/models/Especialidad';
import { PopupComponent } from '../popup/popup.component';
import { Servicio } from 'src/app/models/servicio';
import { ServicioService } from 'src/app/services/Servicio/servicio.service';
import { TipoGuardia } from 'src/app/models/tipoGuardia';
import { tipoGuardiaService } from 'src/app/services/Servicio/tipoGuardia.service';
import { Profesional } from 'src/app/models/profesional';
import { ProfesionalTempService } from 'src/app/services/ProfesionalTemp/profesional-temp.service';
import { ProfesionalService } from 'src/app/services/Servicio/profesional.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { registroActividadService } from 'src/app/services/Servicio/registroActividad.services';
import { RegistroActividad } from 'src/app/models/registroActividad';


@Component({
  selector: 'app-reg-diario',
  templateUrl: './reg-diario.component.html',
  styleUrls: ['./reg-diario.component.css'],
})
export class RegDiarioComponent {

  public routerLinkVariable = "/regDiario/:id";
  servicios: Servicio[] = [];
  tipoGuardias: TipoGuardia[] = [];
  profesional: Profesional = new Profesional("", "", 0);

  formFabi: FormGroup;

  formulario: FormGroup;


  registroActividad: any = {};

  registroForm: FormGroup;
  timeControl: FormControl = new FormControl();
  hospital2: any;
  especialidades: any;
  profesionales: any;
  profesionalSeleccionado: any;
  hospitalSeleccionado: any;
  especialidadesHospital: any;
  tipoServicio: string[] = [
    'Guardia activa',
    'Guardia pasiva',
    'Consultorio',
    'Pase',
  ];
  defaultSelected: string = '';
  pasiva: string = '';
  alert: string = '';
  guardia: string[] = [
    'Guardia extra',
    'Contra Factura',
    'Cargo',
    'Agrupacion',
  ];
  hospital: string[] = [
    'Dn. Pablo Soria',
    'San Roque', 
    'Materno Infantil'
  ];
  especialidad_ps: string[] = [
    'soria',
    'Cirugía General', 
    'Cirugía Cardio Vascular o Vascular Periférica', 
    'Cirugía Reparadora', 
    'Nefrología', 
    'Oftalmología', 
    'Oncología', 
    'Hematología', 
    'Urología', 
    'Traumatología', 
    'UTI-UTIN', 
    'Neurocirugía'
  ];
  especialidad_sr: string[] = [
    'roque',
    'Cirugía General', 
    'Cirugía Reparadora', 
    'Nefrología', 
    'Oncología', 
    'Hematología', 
    'Urología', 
    'Infectología', 
    'Traumatología', 
    'UTI-UTIN', 
    'Neumonología', 
    'Reumatología'
  ];
  especialidad_mi: string[] = [
    'materno',
    'Cirugía General', 
    'Cirugía Cardio Vascular o Vascular Periférica', 
    'Cirugía Reparadora', 
    'Nefrología', 
    'Oftalmología', 
    'Oncología', 
    'Otorrinolaringología', 
    'Psiquiatría', 
    'Hematología', 
    'Urología', 
    'Gastroenterología', 
    'Traumatología', 
    'UTI-UTIN', 
    'Nutrición Infantil', 
    'Cardiología Infantil'
  ];
  /* servicio: string[] = [
    'Guardia central',
    'Cardiología',
    'Cirugia general',
    'Cirugia infantil',
    'Pediatria',
  ]; */

  selectedId: string | undefined;
  selectedCuil: string | undefined;
  selectedDni: string | undefined;
  selectedNombre: string | undefined;
  selectedApellido: string | undefined;
  selectedProfesion: string | undefined;
 

  constructor(
    private _fb: FormBuilder,
    private dialog: MatDialog,

    private servicioService: ServicioService,
    private tipoGuardiaService: tipoGuardiaService,
    private profesionalTemp: ProfesionalTempService,
    private profesionalService: ProfesionalService,
    private toastr: ToastrService,
    private router: Router,



    private professionalDataService: ProfessionalDataServiceService,

    private formBuilder:FormBuilder,
    private registroActividadService: registroActividadService,  // Inyecta el servicio

    private http: HttpClient,
    public dialogRef: MatDialogRef<RegDiarioComponent>
    
  ) {
    // Inicializa el FormGroup y define los FormControl
    this.formFabi = this.formBuilder.group({
      field1: ['', Validators.required],
      field3: ['', Validators.required],
      serv: ['', Validators.required],
      field6: ['', Validators.required],
      est: ['', Validators.required],
      fechaDeIngreso: ['', Validators.required],
      fechaDeEgreso: ['', Validators.required],
      
    });

    this.registroForm = this._fb.group({
      hospital: '',
      servicio: '',
      tipo_guardia: '',
      nombre: '',
      apellido: '',
      dni: '',
      profesion: '',
      hs_ingreso: '',
      fec_ingreso: '',
      hs_egreso: '',
      fec_egreso: '',
    });

    this.formulario= this._fb.group({})
  }

  openDialog(componentParameter: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '800px',
    });

    dialogRef.componentInstance.componentParameter = componentParameter;
    dialogRef.afterClosed().subscribe((result) => {
      console.log('popup closed');
    });
  }

  ngOnInit() {

    this.cargarServicio();
    this.cargarTipoGuardia();
    
    // Con el subscribe escuchamos si la variable sufrió algún cambio
    this.profesionalTemp.profesionalTempId.subscribe(data => {
      this.cargarProfesional(data);
      console.log(`El valor de la variable cambio a: ${data}`);
    });


    //HOSPITALES
      /* this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.hospital = data.filter((element) => element.pasivas === true);
      }); */

      //ESPECIALIDADES
      this.http
      .get<any[]>('../assets/jsonFiles/especialidades.json')
      .subscribe((data) => {
        this.especialidades = data;
      });
  }

  guardar() {
    // Accede a los valores del formulario
    const formData = this.formFabi.value;
    
    // Crea una instancia de RegistroActividad utilizando los datos del formulario
    const registroActividad: RegistroActividad = {
      // Asigna los valores de formData a los campos correspondientes de RegistroActividad
      // Asegúrate de que los nombres de los campos coincidan con los de RegistroActividad
      establecimiento: formData.est,
      fechaIngreso: formData.fechaDeIngreso,
      servicio:formData.serv,
     
      horaIngreso: this.formFabi.get('timeValue')?.value + '',
      
      horaEgreso: this.formFabi.get('timeValue')?.value + '',
      fechaEgreso: formData.fechaDeEgreso,
    };

    // Llama al servicio para guardar los datos
    this.registroActividadService.save(registroActividad).subscribe(
      response => {
        console.log(this.formFabi.get('timeValue')?.value + '');
        console.log('Guardado con éxito', response);
      },
      error => {
        console.error('Error al guardar', error);
      }
    );
  }

  guardarRegistroDiario(){
     // Llama al servicio para guardar el registro de actividad
  this.registroActividadService.save(this.registroActividad)
  .subscribe(
    (respuesta) => {
      // Manejar la respuesta exitosa, como redirigir o mostrar un mensaje de éxito
      console.log('Registro de actividad creado con éxito:', respuesta);
      // Puedes limpiar el formulario o realizar otras acciones después del éxito.
    },
    (error) => {
      // Manejar errores, como mostrar un mensaje de error
      console.error('Error al crear el registro de actividad', error);
    }
  );

  }


  


  cargarServicio(): void {
    this.servicioService.lista().subscribe(
      data => {
        this.servicios = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  cargarTipoGuardia(): void {
    this.tipoGuardiaService.lista().subscribe(
      data => {
        this.tipoGuardias = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  cargarEspecialidades() {
    if (this.hospitalSeleccionado && this.hospitalSeleccionado.especialidades) {
      this.especialidadesHospital = this.especialidades.filter(
        (especialidad: Especialidad) => this.hospitalSeleccionado.especialidades.includes(especialidad.id)
      );
      this.cargarProfesionales();
    } else {
      this.especialidadesHospital = [];
    }
  }


  cargarProfesionales() {
    if (this.hospitalSeleccionado) {
      this.http
        .get<any[]>('../assets/jsonFiles/profesionales.json')
        .subscribe((data) => {
          this.profesionales = data.filter(
            (element) => element.hospital == this.hospitalSeleccionado.descripcion
          );
        });
  } else {
    this.profesionales = [];
  }
}

cargarProfesional(id: number) {
  //const id = this.activatedRoute.snapshot.params['id'];
  if(id != -1){
  this.profesionalService.detail(id).subscribe(
    data => {
      this.profesional = data;
    },
    err => {
      this.toastr.error(err.error.mensaje, 'Fail', {
        timeOut: 3000, positionClass: 'toast-top-center',
      });
      this.router.navigate(['./']);
    }
  );
}
}

/* cargarProfesional(){
  console.log(this.profesionalSeleccionado);
  this.selectedId = this.profesionalSeleccionado.id;
      this.selectedCuil = this.profesionalSeleccionado.cuil;
      this.selectedNombre = this.profesionalSeleccionado.nombre;
      this.selectedApellido = this.profesionalSeleccionado.apellido;
      this.selectedProfesion = this.profesionalSeleccionado.profesion;
      this.selectedDni = this.profesionalSeleccionado.dni;
} */

  cancel() {
    this.dialogRef.close();
  }
}
