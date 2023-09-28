import { HttpClient } from '@angular/common/http';
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

  public routerLinkVariable = "/regDiario/:id";
  profesional: Profesional = new Profesional("", "", 0);

  servicios: Servicio[] = [];
  tipoGuardias: TipoGuardia[] = [];
  

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
}
