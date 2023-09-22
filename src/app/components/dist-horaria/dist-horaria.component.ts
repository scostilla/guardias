import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DistHorariaConsComponent } from '../dist-horaria-cons/dist-horaria-cons.component';
import { DistHorariaGirasComponent } from '../dist-horaria-giras/dist-horaria-giras.component';
import { DistHorariaGuardiaComponent } from '../dist-horaria-guardia/dist-horaria-guardia.component';
import { DistHorariaOtrasComponent } from '../dist-horaria-otras/dist-horaria-otras.component';

@Component({
  selector: 'app-dist-horaria',
  templateUrl: './dist-horaria.component.html',
  styleUrls: ['./dist-horaria.component.css'],
})
export class DistHorariaComponent {

  hospitales:any;
  profesionales:any;
  selectedHospital?: any;
  profesional:string[]= ['FIGUEROA	ELIO','ARRAYA	PEDRO ADEMIR','MORALES	RICARDO','ALFARO	FIDEL','MARTINEZ	YANINA VANESA G.'];
  guardia:string[]= ['Cargo','Agrupacion'];
  dia:string[]= ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
  cons:string[]= ['Consultorio externo','Comisión'];
  turno:string[]= ['Mañana','Tarde'];

  selectedService: string = 'Cargo';
  selectedGuard: string = '';
  disableButton: boolean = this.selectedGuard == '';

  distribForm: FormGroup;
  constructor(
    private http: HttpClient,
    public dialogReg: MatDialog,
    public dialogNov: MatDialog,
    public dialogDistrib: MatDialog,
    private fb: FormBuilder
    ) {
      this.distribForm = this.fb.group({
        hospital: ['', Validators.required],
        profesional: ['', Validators.required],
      })

    }
  options: any[] | undefined;

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.hospitales = data;
      });
  }

  onHospitalSelectionChange(event: any) {
    this.selectedHospital = event.value;
    if (this.selectedHospital) {
        this.http
          .get<any[]>('../assets/jsonFiles/profesionales.json')
          .subscribe((data) => {
            this.profesionales = data.filter(
              (element) => element.hospital == this.selectedHospital.descripcion
            );
          });
    } else {
      this.profesionales = [];
    }
  }

  openDistGuardia(){
    this.dialogReg.open(DistHorariaGuardiaComponent, {
      width: '600px',
      disableClose: true,
    })
  }

  openDistCons(){
    this.dialogReg.open(DistHorariaConsComponent, {
      width: '600px',
      disableClose: true,
    })
  }

  openDistGira(){
    this.dialogReg.open(DistHorariaGirasComponent, {
      width: '600px',
      disableClose: true,
    })
  }

  openDistOtra(){
    this.dialogReg.open(DistHorariaOtrasComponent, {
      width: '600px',
      disableClose: true,
    })
  }


}
