import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-professional-form-delet',
  templateUrl: './professional-form-delet.component.html',
  styleUrls: ['./professional-form-delet.component.css']
})
export class ProfessionalFormDeletComponent implements OnInit {
  id: string | null | undefined;
  person: any;

  registroForm: FormGroup;
  timeControl: FormControl = new FormControl();
  tipoServicio:string[]= ['Guardia activa','Guardia pasiva','Consultorio','Pase'];
  defaultSelected:string='';
  pasiva:string='';
  alert:string='';
  guardia:string[]= ['Guardia extra','Contra Factura','Cargo','Agrupacion'];
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

  constructor(
    private _fb:FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ProfessionalFormDeletComponent>,
    private route: ActivatedRoute, private http: HttpClient,
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

      ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        console.log('ID:', this.id);
        this.cargarDatosperson(parseInt(this.id ?? '', 10));
      }
    
      cargarDatosperson(id: number) {
        this.http
          .get<any[]>('../../../assets/jsonFiles/profesionales.json')
          .subscribe((data: any[]) => {
            this.person = data.find((item) => item.id === id);
            if (this.person) {
              console.log(this.person);
            }
          });
      }
    
  
  openDialog(componentParameter:any){
    const dialogRef = this.dialog.open(PopupComponent,{
      width:'800px'});
    
      dialogRef.componentInstance.componentParameter=componentParameter;
      dialogRef.afterClosed().subscribe((result) => {
        console.log('popup closed');
      })
  }



  cancel() {
    this.dialogRef.close();
  }

}
