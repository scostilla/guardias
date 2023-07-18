import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { ProfessionalDataServiceService } from 'src/app/services/ProfessionalDataService/professional-data-service.service';

@Component({
  selector: 'app-reg-diario',
  templateUrl: './reg-diario.component.html',
  styleUrls: ['./reg-diario.component.css']
})
export class RegDiarioComponent {
  registroForm: FormGroup;
  timeControl: FormControl = new FormControl();
  tipoServicio:string[]= ['Guardia activa','Guardia pasiva','Consultorio','Pase'];
  defaultSelected:string='';
  guardia:string[]= ['Guardia extra','Contra Factura','Cargo','Agrupacion'];
  servicio:string[]=['Guardia central','Cardiología','Cirugia general','Cirugia infantil','Pediatria'];
  especialidad:string[]=['Especialidad 1','Especialidad 2','Especialidad 3','Especialidad 4',];

  selectedId: string | undefined;
  selectedCuil: string | undefined;
  selectedNombre: string | undefined;
  selectedApellido: string | undefined;
  selectedProfesion: string | undefined;

  constructor(
    private _fb:FormBuilder,
    private dialog: MatDialog,
    private professionalDataService: ProfessionalDataServiceService,
    public dialogRef: MatDialogRef<RegDiarioComponent>,
    )
      {
        this.registroForm = this._fb.group(
          {
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

