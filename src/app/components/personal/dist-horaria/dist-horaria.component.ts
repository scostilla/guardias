import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DistHorariaGuardiaComponent } from '../../actividades/dist-horaria-guardia/dist-horaria-guardia.component';
import { DistHorariaConsComponent } from '../../actividades/dist-horaria-cons/dist-horaria-cons.component';
import { DistHorariaGirasComponent } from '../../actividades/dist-horaria-giras/dist-horaria-giras.component';
import { DistHorariaOtrasComponent } from '../../actividades/dist-horaria-otras/dist-horaria-otras.component';
import { AsistencialSelectorComponent } from 'src/app/components/configuracion/usuarios/asistencial-selector/asistencial-selector.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';

@Component({
  selector: 'app-dist-horaria',
  templateUrl: './dist-horaria.component.html',
  styleUrls: ['./dist-horaria.component.css'],
})
export class DistHorariaComponent {

  inputValue: string = '';
  selectedAsistencial?: Asistencial;

  hospitales: string[] = ['DN. PABLO SORIA'];
  profesional: string[] = ['FIGUEROA ELIO', 'ARRAYA PEDRO ADEMIR', 'MORALES RICARDO', 'ALFARO FIDEL', 'MARTINEZ YANINA VANESA G.'];
  guardia: string[] = ['Cargo', 'Agrupacion'];
  dia: string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  cons: string[] = ['Consultorio externo', 'Comisión'];
  turno: string[] = ['Mañana', 'Tarde'];

  selectedService: string = 'Cargo';
  selectedGuard: string = '';
  disableButton: boolean = this.selectedGuard == '';

  distribForm: FormGroup;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.distribForm = this.fb.group({
      hospital: ['', Validators.required],
      profesional: ['', Validators.required],
    });
  }

  options: any[] | undefined;

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.options = data;
      });
  }

  saveDistribucion(){}

  openAsistencialDialog(): void {
    const dialogRef = this.dialog.open(AsistencialSelectorComponent, {
      width: '600px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Asume que result es de tipo Asistencial
        this.selectedAsistencial = result;
        this.inputValue = `${result.apellido} ${result.nombre}`;
      }
    });
  }


  /*openDistGuardia() {
    this.dialogReg.open(DistHorariaGuardiaComponent, {
      width: '600px',
      disableClose: true,
    });
  }

  openDistCons() {
    this.dialogReg.open(DistHorariaConsComponent, {
      width: '600px',
      disableClose: true,
    });
  }

  openDistGira() {
    this.dialogReg.open(DistHorariaGirasComponent, {
      width: '600px',
      disableClose: true,
    });
  }

  openDistOtra() {
    this.dialogReg.open(DistHorariaOtrasComponent, {
      width: '600px',
      disableClose: true,
    });
  }

  get isProfesionalSelected(): boolean {
    return this.distribForm.get('profesional')?.value !== '';
  }*/
}
