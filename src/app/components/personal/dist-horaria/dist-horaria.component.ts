import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DistHorariaGuardiaComponent } from '../../actividades/dist-horaria-guardia/dist-horaria-guardia.component';
import { DistHorariaConsComponent } from '../../actividades/dist-horaria-cons/dist-horaria-cons.component';
import { DistHorariaGirasComponent } from '../../actividades/dist-horaria-giras/dist-horaria-giras.component';
import { DistHorariaOtrasComponent } from '../../actividades/dist-horaria-otras/dist-horaria-otras.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dist-horaria',
  templateUrl: './dist-horaria.component.html',
  styleUrls: ['./dist-horaria.component.css'],
})
export class DistHorariaComponent {

  hospitales:string[]= ['DN. PABLO SORIA'];
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
        this.options = data;
      });
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
