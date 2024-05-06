import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopupComponent } from '../../popup/popup.component';
import { ProfessionalDataServiceService } from 'src/app/services/ProfessionalDataService/professional-data-service.service';
import { RegistroActividad } from 'src/app/models/RegistroActividad';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { TipoGuardiaService } from 'src/app/services/tipoGuardia.service';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';

@Component({
  selector: 'app-reg-diario',
  templateUrl: './reg-diario.component.html',
  styleUrls: ['./reg-diario.component.css']
})
export class RegDiarioComponent {
  registroForm: FormGroup;
  initialData: any;
  tiposGuardias: TipoGuardia[] = [];
  asistenciales: Asistencial[]=[];


  timeControl: FormControl = new FormControl();
  tipoServicio: string[] = ['Guardia activa', 'Guardia pasiva', 'Consultorio', 'Pase'];
  defaultSelected: string = '';
  pasiva: string = '';
  alert: string = '';
  guardia: string[] = ['Guardia extra', 'Contra Factura', 'Cargo', 'Agrupacion'];
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

  //minDate: string;
  currentDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RegDiarioComponent>,
    private registroActividadService: RegistroActividadService,
    private tipoGuardiaService: TipoGuardiaService,
    private asistencialService: AsistencialService,

    private dialog: MatDialog,
    private professionalDataService: ProfessionalDataServiceService,


    @Inject(MAT_DIALOG_DATA) public data: RegistroActividad
  ) {
    this.registroForm = this.fb.group({
      tipoGuardia: ['', Validators.required],
      asistencial: ['', Validators.required],


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
    // Obteniendo la fecha actual y estableciéndola como la fecha mínima
    const currentDate = new Date();
    //this.minDate = currentDate.toISOString().split('T')[0];// Formatear la fecha como 'YYYY-MM-DD'


    this.listTiposGuardias();
    this.listAsistenciales();

    if (data) {
      this.registroForm.patchValue(data);
    }
    
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

  onTipoGuardiaChange(event: any) {
    console.log("Tipo de guardia seleccionado:", event.value);
  }
  
  ngOnInit() {

    this.professionalDataService.dataUpdated.subscribe(() => {
      this.selectedId = this.professionalDataService.selectedId;
      this.selectedCuil = this.professionalDataService.selectedCuil;
      this.selectedNombre = this.professionalDataService.selectedNombre;
      this.selectedApellido = this.professionalDataService.selectedApellido;
      this.selectedProfesion = this.professionalDataService.selectedProfesion;
    });
  }

  listTiposGuardias(): void{
    this.tipoGuardiaService.list().subscribe(data => {
      console.log('Lista de Tipos de Guardias:', data);
      this.tiposGuardias = data;
    }, error => {
      console.log(error);
    });
  }

  listAsistenciales(): void{
    this.asistencialService.list().subscribe(data => {
      console.log('Lista de asistenciales de cargo:', data);
      this.asistenciales = data;
    }, error => {
      console.log(error);
    });
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.registroForm.value);
  }

  saveLegajo(): void { }

  compareTipoGuardia(p1: TipoGuardia, p2: TipoGuardia): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareAsistencial(p1: Asistencial, p2: Asistencial): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
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

