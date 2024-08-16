import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ValorGmi } from 'src/app/models/ValorGmi';
import { ValorGmiService } from 'src/app/services/valorGmi.service';
import { ValoresGuardiasCreateComponent } from '../valores-guardias-create/valores-guardias-create.component';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');



@Component({
  selector: 'app-valores-guardias',
  templateUrl: './valores-guardias.component.html',
  styleUrls: ['./valores-guardias.component.css']
})
export class ValoresGuardiasComponent implements OnInit, OnDestroy {
  valorGmiCargo!: number;
  valorGmiLV!: number;
  valorGmiSDF!: number;
  valorB1580LV = 16801.63;
  valorB1580SDF = 18481.79;
  valorGmiFecha!: string;

  dialogRef!: MatDialogRef<ValoresGuardiasCreateComponent>;
  suscription!: Subscription;

  constructor(
    private valorGmiService: ValorGmiService,
    private dialog: MatDialog,
    private toastr: ToastrService,
) { }

ngOnInit(): void {
  this.obtenerValorGmi();
}

obtenerValorGmi() {
  this.valorGmiService.list().subscribe((valores: ValorGmi[]) => {
    console.log('Datos recibidos:', valores);

    let valorGmiMayorFechaInicio: ValorGmi | undefined;

    valores.forEach(valor => {
      const fechaInicio = moment(valor.fechaInicio, 'YYYY-MM-DD');
      
      if (!valorGmiMayorFechaInicio || fechaInicio.isAfter(moment(valorGmiMayorFechaInicio.fechaInicio, 'YYYY-MM-DD'))) {
        valorGmiMayorFechaInicio = valor;
      }
    });

    console.log('Valor con la mayor fecha de inicio:', valorGmiMayorFechaInicio);
    if (valorGmiMayorFechaInicio) {
      this.valorGmiCargo = valorGmiMayorFechaInicio.monto;
      this.valorGmiLV = this.valorGmiCargo * 2;
      this.valorGmiSDF = this.valorGmiLV * 1.10;

      const fecha = moment(valorGmiMayorFechaInicio.fechaInicio);
      const mes = fecha.format('MMMM').toUpperCase();
      const año = fecha.format('YYYY');
      this.valorGmiFecha = `${mes}/${año}`;
    } else {
      this.valorGmiCargo = 0;
      this.valorGmiLV = 0;
      this.valorGmiSDF = 0;
      this.valorGmiFecha = '';
    }

    console.log('valorGmiCargo después de la asignación:', this.valorGmiCargo); // Verifica el valor
  });
}

  openCreate(): void {
    const dialogRef = this.dialog.open(ValoresGuardiasCreateComponent, {
      width: '600px',
      data: null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result) {
          this.toastr.success('Valor GMI agregado con éxito', 'ÉXITO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
  
        } else {
          this.toastr.error('Ocurrió un error al intentar agregar el valor GMI', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
}

}
