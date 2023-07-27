import { Component } from '@angular/core';
import { RegistroDiarioComponent } from '../registro-diario/registro-diario.component';
import { MatDialog } from '@angular/material/dialog';
import { RegDiarioComponent } from '../reg-diario/reg-diario.component';
import { NovedadesFormComponent } from '../novedades-form/novedades-form.component';
import { DistHorariaComponent } from '../dist-horaria/dist-horaria.component';

@Component({
  selector: 'app-registro-actividades',
  templateUrl: './registro-actividades.component.html',
  styleUrls: ['./registro-actividades.component.css']
})
export class RegistroActividadesComponent {

  constructor(
    public dialogReg: MatDialog,
    public dialogNov: MatDialog,
    public dialogDistrib: MatDialog,
    ) {}

  openRegistroDiario(){
    this.dialogReg.open(RegDiarioComponent, {
      width: '600px',
      disableClose: true,
    })
  }

  openNovedades(){
    this.dialogNov.open(NovedadesFormComponent, {
      width: '600px',
      disableClose: true,
    })
  }

  openDistribucion(){
    this.dialogDistrib.open(DistHorariaComponent, {
      width: '600px',
      disableClose: true,
    })
  }

  /*
  addRegistro() {
    const dialogRef = this.dialog.open(RegistroDiarioComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog addEditProfessional was closed');
    });
  }
*/
}
