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
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { ServicioService } from 'src/app/services/servicio.service';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { RegistroActividadDto } from 'src/app/dto/RegistroActividadDto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro-diario-profesional',
  templateUrl: './registro-diario-profesional.component.html',
  styleUrls: ['./registro-diario-profesional.component.css']
})
export class RegistroDiarioProfesionalComponent {

    registroForm: FormGroup;
    initialData: any;
    tiposGuardias: TipoGuardia[] = [];
    asistenciales: Asistencial[]=[];
    servicios: Servicio[]=[];
    efectores: Efector[]=[];
  
  
    timeControl: FormControl = new FormControl();
    defaultSelected: string = '';
    pasiva: string = '';
    alert: string = '';
   
    currentDate: Date = new Date();

    defaultAsistencial: Asistencial = this.asistenciales[1];

    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<RegistroDiarioProfesionalComponent>,
      private registroActividadService: RegistroActividadService,
      private tipoGuardiaService: TipoGuardiaService,
      private asistencialService: AsistencialService,
      private servicioService: ServicioService,
      private hospitalService: HospitalService,
      private toastr: ToastrService,
  
      private dialog: MatDialog,
     
      @Inject(MAT_DIALOG_DATA) public data: RegistroActividad
    ) {
      this.registroForm = this.fb.group({
        tipoGuardia: ['', Validators.required],
        asistencial: [this.defaultAsistencial, Validators.required],
        servicio: ['', Validators.required],
        efector: ['', Validators.required],
  
        fecIngreso: ['', Validators.required],
        eventStartTime: ['', Validators.required],
        fecEgreso: [''],
        eventEndTime: ['']
      })
      // Obteniendo la fecha actual y estableciéndola como la fecha mínima
      const currentDate = new Date();
  
      this.listTiposGuardias();
      this.listAsistenciales();
      this.listServicios();
      this.listEfectores();
  
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
  
    listServicios(): void{
      this.servicioService.list().subscribe(data => {
        console.log('Lista de servicios:', data);
        this.servicios = data;
      }, error => {
        console.log(error);
      });
    }
  
    listEfectores(): void{
      /* aqui falta agregar metodo en back para que liste todos los efectores, de momento solo mostramos hospitales */
      this.hospitalService.list().subscribe(data => {
        console.log('Lista de efectores:', data);
        this.efectores = data;
      }, error => {
        console.log(error);
      });
    }
  
    isModified(): boolean {
      return JSON.stringify(this.initialData) !== JSON.stringify(this.registroForm.value);
    }
  
    saveRegistro(): void {
      if (this.registroForm.valid) {
        const registroData = this.registroForm.value;
  
        // Obtener el valor del campo de hora de inicio
        const horaInicio = this.registroForm.get('eventStartTime')?.value;
        console.log('##############Hora de inicio seleccionada:', horaInicio);
        
        // Obtener el valor del campo de hora de inicio
        const horaFin = this.registroForm.get('eventEndTime')?.value;
        console.log('##############Hora de fin seleccionada:', horaInicio);
        
  
        const registroDto = new RegistroActividadDto(
          registroData.fecIngreso,
          registroData.fecEgreso,
          registroData.eventStartTime,
          registroData.eventEndTime,
          registroData.tipoGuardia.id,
          registroData.activo, 
          registroData.asistencial.id,
          registroData.servicio.id,
          registroData.efector.id
          
      );
      if (this.data && this.data.id) {
        this.registroActividadService.update(this.data.id, registroDto).subscribe(
          result => {
            this.toastr.success('Legajo creado con éxito', 'EXITO', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.toastr.error('Ocurrió un error al crear o editar el Legajo', 'Error', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        this.registroActividadService.save(registroDto).subscribe(
          result => {
            this.toastr.success('Registro guardado con éxito', 'EXITO', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.toastr.error('Ocurrió un error al guardar el registro', 'Error', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      }
    }
    }
  
    compareTipoGuardia(p1: TipoGuardia, p2: TipoGuardia): boolean {
      return p1 && p2 ? p1.id === p2.id : p1 === p2;
    }
  
    compareAsistencial(p1: Asistencial, p2: Asistencial): boolean {
      return p1 && p2 ? p1.id === p2.id : p1 === p2;
    }
  
    compareServicio(p1: Servicio, p2: Servicio): boolean {
      return p1 && p2 ? p1.id === p2.id : p1 === p2;
    }
  
    compareEfector(p1: Efector, p2: Efector): boolean {
      return p1 && p2 ? p1.id === p2.id : p1 === p2;
    }
  
    cancel() {
      this.dialogRef.close();
    }
  
  }