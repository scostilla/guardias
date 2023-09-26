import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Servicio } from 'src/app/models/servicio';
import { ProfessionalDataServiceService } from 'src/app/services/ProfessionalDataService/professional-data-service.service';
import { ServicioService } from 'src/app/services/Servicio/servicio.service';
import { PopupComponent } from '../popup/popup.component';
import { TipoGuardia } from 'src/app/models/tipoGuardia';
import { tipoGuardiaService } from 'src/app/services/Servicio/tipoGuardia.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfesionalService } from 'src/app/services/Servicio/profesional.service';
import { Profesional } from 'src/app/models/profesional';
import { RegDiarioComponent } from '../reg-diario/reg-diario.component';
import { ProfesionalTempService } from 'src/app/services/ProfesionalTemp/profesional-temp.service';


@Component({
  selector: 'app-formulario-reg-diario',
  templateUrl: './formulario-reg-diario.component.html',
  styleUrls: ['./formulario-reg-diario.component.css']
})
export class FormularioRegDiarioComponent {

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
    private professionalDataService: ProfessionalDataServiceService,
    public dialogRef: MatDialogRef<RegDiarioComponent>,

    private profesionalTemp: ProfesionalTempService,

    private servicioService: ServicioService,
    private tipoGuardiaService: tipoGuardiaService,
    
    private profesionalService: ProfesionalService,
    //private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
    
  ) {
    const navigation = router.getCurrentNavigation();
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
    console.log(`El valor de la variable cambio a: 9`);
    // Con el subscribe escuchamos si la variable sufrió algún cambio
    this.profesionalTemp.miVariable$.subscribe(data => {
      console.log(`El valor de la variable cambio a: ${data}`);
    });
    //this.cargarProfesional(1);

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

    
    /* const navigation = history.state.data;
    holahssss
    console.log('######### id:', navigation);
    let objeto = navigation.extras.state as { example: Profesional };
    this.profesional = objeto.example as Profesional;
    console.info(this.profesional.idPersona); */


    /* PRUEBA 2 */
    /* const navigation = this.router.getCurrentNavigation(['regDiario'],id);
    let objeto = navigation.extras.state as { example: Profesional };
    this.profesional = objeto.example as Profesional;
    console.info(this.profesional.idPersona); */

    this.professionalDataService.dataUpdated.subscribe(() =>
    {
      this.selectedId = this.professionalDataService.selectedId;
      this.selectedCuil = this.professionalDataService.selectedCuil;
      this.selectedNombre = this.professionalDataService.selectedNombre;
      this.selectedApellido = this.professionalDataService.selectedApellido;
      this.selectedProfesion = this.professionalDataService.selectedProfesion;
    });

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

  public cargarProfesional(id:any) {
    //const id = this.activatedRoute.snapshot.params['id'];
    this.profesionalService.detail(id).subscribe(
      data => {
        console.log("######### entra id desde comp: " + id);
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

  borrarServicio(id: any) {
    this.servicioService.delete(id).subscribe(
      data => {

        this.toastr.success('Producto Eliminado', 'OK', {
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
