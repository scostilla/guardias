import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Servicio } from 'src/app/models/servicio';
import { ServicioService } from 'src/app/services/Servicio/servicio.service';
import { PopupComponent } from '../popup/popup.component';
import { TipoGuardia } from 'src/app/models/tipoGuardia';
import { tipoGuardiaService } from 'src/app/services/Servicio/tipoGuardia.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfesionalService } from 'src/app/services/Servicio/profesional.service';
import { Profesional } from 'src/app/models/profesional';
import { ProfesionalTempService } from 'src/app/services/ProfesionalTemp/profesional-temp.service';

@Component({
  selector: 'app-reg-diario',
  templateUrl: './reg-diario.component.html',
  styleUrls: ['./reg-diario.component.css']
})

export class RegDiarioComponent {

  public routerLinkVariable = "/regDiario/:id";
  profesional: Profesional = new Profesional("", "", 0);

  servicios: Servicio[] = [];
  tipoGuardias: TipoGuardia[] = [];
  

  registroForm: FormGroup;
  timeControl: FormControl = new FormControl();
  //tipoServicio:string[]= ['Guardia activa','Guardia pasiva','Consultorio','Pase'];
  defaultSelected: string = '';
  pasiva: string = '';
  alert: string = '';
  //aqui comentar linea de abajo
  //guardia:string[]= ['Guardia extra','Contra Factura','Cargo','Agrupacion'];
  servicio: string[] = ['Guardia central', 'Cardiología', 'Cirugia general', 'Cirugia infantil', 'Pediatria'];
  hospital: string[] = ['Dn. Pablo Soria', 'San Roque', 'Materno Infantil'];
  especialidad_ps: string[] = ['Cirugía General', 'Cirugía Cardio Vascular o Vascular Periférica', 'Cirugía Reparadora', 'Nefrología', 'Oftalmología', 'Oncología', 'Hematología', 'Urología', 'Traumatología', 'UTI-UTIN', 'Neurocirugía'];
  especialidad_sr: string[] = ['Cirugía General', 'Cirugía Reparadora', 'Nefrología', 'Oncología', 'Hematología', 'Urología', 'Infectología', 'Traumatología', 'UTI-UTIN', 'Neumonología', 'Reumatología'];
  especialidad_mi: string[] = ['Cirugía General', 'Cirugía Cardio Vascular o Vascular Periférica', 'Cirugía Reparadora', 'Nefrología', 'Oftalmología', 'Oncología', 'Otorrinolaringología', 'Psiquiatría', 'Hematología', 'Urología', 'Gastroenterología', 'Traumatología', 'UTI-UTIN', 'Nutrición Infantil', 'Cardiología Infantil'];
  selectedId: string | undefined;
  selectedCuil: string | undefined;
  selectedNombre: string | undefined;
  selectedApellido: string | undefined;
  selectedProfesion: string | undefined;


  constructor(
    private _fb: FormBuilder,
    private dialog: MatDialog,
   /*  private professionalDataService: ProfessionalDataServiceService, */
    public dialogRef: MatDialogRef<RegDiarioComponent>,

    private profesionalTemp: ProfesionalTempService,

    private servicioService: ServicioService,
    private tipoGuardiaService: tipoGuardiaService,
    
    private profesionalService: ProfesionalService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
    
  ) {
    this.registroForm = this._fb.group(
      {
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
      })
  }

  openDialog(componentParameter: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '800px'
    });

    dialogRef.componentInstance.componentParameter = componentParameter;
    dialogRef.afterClosed().subscribe((result) => {
      console.log('popup closed');
    })
  }

  ngOnInit() {

    this.cargarServicio();
    this.cargarTipoGuardia();
    
    // Con el subscribe escuchamos si la variable sufrió algún cambio
    this.profesionalTemp.profesionalTempId.subscribe(data => {
      this.cargarProfesional(data);
      console.log(`El valor de la variable cambio a: ${data}`);
    });

   /*  const id= this.activatedRoute.snapshot.params['idPersona'];
    this.profesionalService.detail(id).subscribe(
      data => {
        this.profesional = data;
        console.log(this.profesional.nombre);
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Fail',{
          timeOut:3000, positionClass: 'toast-top-center',
        });
        this.router.navigate(['nuevo']);
        console.log('error fabi, no guardo el objeto');
      }
    ) */

    
  /*   const navigation = history.state.data;
    console.log('######### id:', navigation);
    let objeto = navigation.extras.state as { example: Profesional };
    this.profesional = objeto.example as Profesional;
    console.info(this.profesional.idPersona); */


    /* PRUEBA 2 */
    /* const navigation = this.router.getCurrentNavigation(['regDiario'],id);
    let objeto = navigation.extras.state as { example: Profesional };
    this.profesional = objeto.example as Profesional;
    console.info(this.profesional.idPersona); */

    /* this.professionalDataService.dataUpdated.subscribe(() =>
    {
      this.selectedId = this.professionalDataService.selectedId;
      this.selectedCuil = this.professionalDataService.selectedCuil;
      this.selectedNombre = this.professionalDataService.selectedNombre;
      this.selectedApellido = this.professionalDataService.selectedApellido;
      this.selectedProfesion = this.professionalDataService.selectedProfesion;
    }); */

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

  borrarServicio(id: any) {
    this.servicioService.delete(id).subscribe(
      data => {

        this.toastr.success('Servicio Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.cargarServicio();
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

  cancel() {
    this.dialogRef.close();
  }

}


/* esto es lo de Json2 */
/* import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProfessionalDataServiceService } from 'src/app/services/ProfessionalDataService/Professional-data-service.service';
import Especialidad from 'src/server/models/Especialidad';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-reg-diario',
  templateUrl: './reg-diario.component.html',
  styleUrls: ['./reg-diario.component.css'],
})
export class RegDiarioComponent {
  registroForm: FormGroup;
  timeControl: FormControl = new FormControl();
  hospital: any;
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
  servicio: string[] = [
    'Guardia central',
    'Cardiología',
    'Cirugia general',
    'Cirugia infantil',
    'Pediatria',
  ];

  selectedId: string | undefined;
  selectedCuil: string | undefined;
  selectedDni: string | undefined;
  selectedNombre: string | undefined;
  selectedApellido: string | undefined;
  selectedProfesion: string | undefined;

  constructor(
    private _fb: FormBuilder,
    private dialog: MatDialog,
    private professionalDataService: ProfessionalDataServiceService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<RegDiarioComponent>
  ) {
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

    //HOSPITALES
      this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.hospital = data.filter((element) => element.pasivas === true);
      });

      //ESPECIALIDADES
      this.http
      .get<any[]>('../assets/jsonFiles/especialidades.json')
      .subscribe((data) => {
        this.especialidades = data;
      });
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

cargarProfesional(){
  console.log(this.profesionalSeleccionado);
  this.selectedId = this.profesionalSeleccionado.id;
      this.selectedCuil = this.profesionalSeleccionado.cuil;
      this.selectedNombre = this.profesionalSeleccionado.nombre;
      this.selectedApellido = this.profesionalSeleccionado.apellido;
      this.selectedProfesion = this.profesionalSeleccionado.profesion;
      this.selectedDni = this.profesionalSeleccionado.dni;
}

  cancel() {
    this.dialogRef.close();
  }
} */