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

  //minDate: string;
  currentDate:Date = new Date();

  constructor(
    private _fb: FormBuilder,
    private dialog: MatDialog,
    private professionalDataService: ProfessionalDataServiceService,
    public dialogRef: MatDialogRef<RegDiarioComponent>,
    )
      {
        this.registroForm = this._fb.group(
          {
      hospital:'',
      servicio:'',
      tipo_guardia:'',
      nombre:'',
      apellido:'',
      dni:'',
      profesion:'',
      hs_ingreso:'',
      fec_ingreso:'',
      hs_egreso:'',
      fec_egreso:'',
          })
          // Obteniendo la fecha actual y estableciéndola como la fecha mínima
          const currentDate = new Date();
          //this.minDate = currentDate.toISOString().split('T')[0];// Formatear la fecha como 'YYYY-MM-DD'
      }

  openDialog(componentParameter:any){
    const dialogRef = this.dialog.open(PopupComponent,{
      width:'800px'});

      dialogRef.componentInstance.componentParameter=componentParameter;
      dialogRef.afterClosed().subscribe((result) => {
        console.log('popup closed');
      })
  }

  ngOnInit() {

    //HOSPITALES
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.hospital = data;
      });

      //ESPECIALIDADES
      this.http
      .get<any[]>('../assets/jsonFiles/especialidades.json')
      .subscribe((data) => {
        this.especialidades = data;
      });


    this.professionalDataService.dataUpdated.subscribe(() => {
      this.selectedId = this.professionalDataService.selectedId;
      this.selectedCuil = this.professionalDataService.selectedCuil;
      this.selectedNombre = this.professionalDataService.selectedNombre;
      this.selectedApellido = this.professionalDataService.selectedApellido;
      this.selectedProfesion = this.professionalDataService.selectedProfesion;
      this.selectedDni = this.professionalDataService.selectedDni;
    });
  }


  cargarEspecialidades() {
    if (this.hospitalSeleccionado && this.hospitalSeleccionado.especialidades) {
      this.especialidadesHospital = this.especialidades.filter(
        (especialidad: Especialidad) => this.hospitalSeleccionado.especialidades.includes(especialidad.id)
      );
    } else {
      this.especialidadesHospital = [];
    }
  }


  cancel() {
    this.dialogRef.close();
  }
}

/* no abre el popup a pesar de tener el mismo codigo que el metodo openDialog
  openPopup(componentParameter:any){
    const dialogRef = this.dialog.open(PopupComponent,{
      width:'1000px',
    });

    dialogRef.componentInstance.componentParameter = componentParameter;
    dialogRef.afterClosed().subscribe((result) => {
      console.log('popup closed');
    })
  }

*/
