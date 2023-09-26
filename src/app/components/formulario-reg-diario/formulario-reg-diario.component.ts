import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Profesional } from 'src/app/models/profesional';
import { Servicio } from 'src/app/models/servicio';
import { TipoGuardia } from 'src/app/models/tipoGuardia';
import { ProfessionalDataServiceService } from 'src/app/services/ProfessionalDataService/professional-data-service.service';
//import { RegDiarioComponent } from '../reg-diario/reg-diario.component';
import { ServicioService } from 'src/app/services/Servicio/servicio.service';
import { tipoGuardiaService } from 'src/app/services/Servicio/tipoGuardia.service';
import { ProfesionalService } from 'src/app/services/Servicio/profesional.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PopupComponent } from '../popup/popup.component';
import { MatTableDataSource } from '@angular/material/table';
import { DialogServiceService } from 'src/app/services/DialogService/dialog-service.service';




@Component({
  selector: 'app-formulario-reg-diario',
  templateUrl: './formulario-reg-diario.component.html',
  styleUrls: ['./formulario-reg-diario.component.css']
})
export class FormularioRegDiarioComponent implements OnInit {

  @Input()


  public routerLinkVariable = "/regDiario/:id";
  profesional: Profesional = new Profesional("", "", 0);

  servicios: Servicio[] = [];
  tipoGuardias: TipoGuardia[] = [];

  //esto cambié : dataSource: MatTableDataSource<Profesional>
  dataSource: MatTableDataSource<Profesional> = new MatTableDataSource<Profesional>;


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
  contador = 0;
  bandera: boolean = false;


  constructor(
    private _fb: FormBuilder,
    private dialog: MatDialog,

    private servicioService: ServicioService,
    private tipoGuardiaService: tipoGuardiaService,
    private profesionalService: ProfesionalService,

    private professionalDataService: ProfessionalDataServiceService,
    private dialogService: DialogServiceService,

    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,


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

  /* FALTA RESOLVER
    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  } */

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
   // this.cargarProfesional();

    this.profesionalService.lista().subscribe(
      profesionales => {
        this.dataSource.data = profesionales;
      },
    );

    if (null != this.activatedRoute.snapshot.params['id']) {
      const id = this.activatedRoute.snapshot.params['id'];
      console.log("################## id3 : " + id);
      this.profesionalService.detail(id).subscribe(
        data => {
          this.profesional = data;
          console.log(this.profesional.nombre);
        },
        err => {
          this.toastr.error(err.error.mensaje, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
          this.router.navigate(['formRegDiario']);
          console.log('error fabi, no guardo el objeto');
        }
      )
    } else {
      console.log('vacio');
    }


    const navigation = history.state.data;
    console.log('######### id4:', navigation);
    let objeto = navigation.extras.state as { example: Profesional };
    this.profesional = objeto.example as Profesional;
    console.info(this.profesional.idPersona);


    /* PRUEBA 2 */
    /* const navigation = this.router.getCurrentNavigation(['regDiario'],id);
    let objeto = navigation.extras.state as { example: Profesional };
    this.profesional = objeto.example as Profesional;
    console.info(this.profesional.idPersona); */

    /*  this.professionalDataService.dataUpdated.subscribe(() =>
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

  cargarProfesional(id: any) {
    //const id = this.activatedRoute.snapshot.params['id'];
    console.log("############### id prof: "+id);
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
    this.mostraTabla();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRowDoubleClick(row: any) {
    console.log('professional table id1:', row.idPersona);
    const id= row.idPersona;
    this.cargarProfesional(id);
    //NavigationExtras = {state: {idPersona: row.idPersona}};
    //console.log('professional table id2:', id);
    //this.router.navigate(['/']);
    //this.router.navigate(['/formRegDiario'],{ state:{ idPersona:id } });
    //console.log('professional table id:', id);
    //this.professionalDataService.dataUpdated.emit();
    //this.dialogService.closeDialog();
  }
  mostraTabla(){
    if(this.bandera==true)
    this.bandera = false;
  else
    this.bandera = true;
  }
}
