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

@Component({
  selector: 'app-reg-diario',
  templateUrl: './reg-diario.component.html',
  styleUrls: ['./reg-diario.component.css']
})
export class RegDiarioComponent {
  profesional: Profesional = new Profesional("","",0);
  registroForm: FormGroup;
  timeControl: FormControl = new FormControl();
  //tipoServicio:string[]= ['Guardia activa','Guardia pasiva','Consultorio','Pase'];
  defaultSelected:string='';
  pasiva:string='';
  alert:string='';
  //aqui comentar linea de abajo
  //guardia:string[]= ['Guardia extra','Contra Factura','Cargo','Agrupacion'];
  servicio:string[]=['Guardia central','Cardiología','Cirugia general','Cirugia infantil','Pediatria'];
  hospital:string[]= ['Dn. Pablo Soria','San Roque','Materno Infantil'];
  especialidad_ps:string[]=['Cirugía General','Cirugía Cardio Vascular o Vascular Periférica','Cirugía Reparadora','Nefrología','Oftalmología','Oncología','Hematología','Urología','Traumatología','UTI-UTIN','Neurocirugía'];
  especialidad_sr:string[]=['Cirugía General','Cirugía Reparadora','Nefrología','Oncología','Hematología','Urología','Infectología','Traumatología','UTI-UTIN','Neumonología','Reumatología'];
  especialidad_mi:string[]=['Cirugía General','Cirugía Cardio Vascular o Vascular Periférica','Cirugía Reparadora','Nefrología','Oftalmología','Oncología','Otorrinolaringología','Psiquiatría','Hematología','Urología','Gastroenterología','Traumatología','UTI-UTIN','Nutrición Infantil','Cardiología Infantil'];


  selectedId: string | undefined;
  selectedCuil: string | undefined;
  selectedNombre: string | undefined;
  selectedApellido: string | undefined;
  selectedProfesion: string | undefined;

  servicios: Servicio[] = [];
  tipoGuardias: TipoGuardia[] = [];


  constructor(
    private _fb:FormBuilder,
    private dialog: MatDialog,
    private professionalDataService: ProfessionalDataServiceService,
    public dialogRef: MatDialogRef<RegDiarioComponent>,
    private servicioService: ServicioService,
    private tipoGuardiaService: tipoGuardiaService,
    private activatedRoute: ActivatedRoute,
    private profesionalService: ProfesionalService,
    private router: Router,
    private toastr: ToastrService
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
    
    this.cargarServicio();
    this.cargarTipoGuardia();

    this.professionalDataService.dataUpdated.subscribe(() => {
      this.selectedId = this.professionalDataService.selectedId;
      this.selectedCuil = this.professionalDataService.selectedCuil;
      this.selectedNombre = this.professionalDataService.selectedNombre;
      this.selectedApellido = this.professionalDataService.selectedApellido;
      this.selectedProfesion = this.professionalDataService.selectedProfesion;
    });
  }

  cancel() {
    this.dialogRef.close();
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
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
      }
    );
  }

  cargarProfesional(){
    const id = this.activatedRoute.snapshot.params['id'];
    this.profesionalService.detail(id).subscribe(
      data => {
        this.profesional = data;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Fail', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        this.router.navigate(['./']);
      }
    );
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

