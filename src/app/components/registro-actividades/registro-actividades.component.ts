import { Component } from '@angular/core';
import { RegistroDiarioComponent } from '../registro-diario/registro-diario.component';
import { MatDialog } from '@angular/material/dialog';
import { RegDiarioComponent } from '../reg-diario/reg-diario.component';

@Component({
  selector: 'app-registro-actividades',
  templateUrl: './registro-actividades.component.html',
  styleUrls: ['./registro-actividades.component.css']
})
export class RegistroActividadesComponent {

  constructor(public dialog: MatDialog) {}

  openRegistroDiario(){
    this.dialog.open(RegDiarioComponent)
  }

  addRegistro() {
    const dialogRef = this.dialog.open(RegistroDiarioComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog addEditProfessional was closed');
    });
  }

}
