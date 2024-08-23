import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ValorGmi } from 'src/app/models/ValorGmi';
import { ValorGmiService } from 'src/app/services/valorGmi.service';
import { ValorBonoUti } from 'src/app/models/ValorBonoUti';
import { ValorBonoUtiService } from 'src/app/services/valorBonoUti.service';
import { ValoresGuardiasCreateComponent } from '../valores-guardias-create/valores-guardias-create.component';
import { ValoresBonoUtiCreateComponent } from '../valores-bono-uti-create/valores-bono-uti-create.component';
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
  valorGmiDoc!: string;
  valorBonoUti!: number;

  dialogRef!: MatDialogRef<ValoresGuardiasCreateComponent>;
  suscription!: Subscription;

  constructor(
    private valorGmiService: ValorGmiService,
    private valorBonoUtiService: ValorBonoUtiService,
    private dialog: MatDialog,
    private toastr: ToastrService,
) { }

ngOnInit(): void {
  this.obtenerValorGmi();
  this.obtenerValorUti();
}

obtenerValorGmi() {
  this.valorGmiService.list().subscribe((valores: ValorGmi[]) => {
    console.log('Datos recibidos:', valores);

    let valorGmiMayorFechaInicio: ValorGmi | undefined;

    valores = valores.filter(valor => valor.tipoGuardia === 1);

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

    console.log('valorGmiCargo después de la asignación:', this.valorGmiCargo);
  });
}

obtenerValorUti() {
  this.valorBonoUtiService.list().subscribe((valores: ValorBonoUti[]) => {
    console.log('Datos recibidos:', valores);

    let valorUtiMayorFechaInicio: ValorBonoUti | undefined;

    valores.forEach(valor => {
      const fechaInicio = moment(valor.fechaInicio, 'YYYY-MM-DD');

      if (!valorUtiMayorFechaInicio || fechaInicio.isAfter(moment(valorUtiMayorFechaInicio.fechaInicio, 'YYYY-MM-DD'))) {
        valorUtiMayorFechaInicio = valor;
      }
    });

    console.log('Valor con la mayor fecha de inicio:', valorUtiMayorFechaInicio);
    if (valorUtiMayorFechaInicio) {
      this.valorBonoUti = valorUtiMayorFechaInicio.monto;
    } else {
      this.valorBonoUti = 0;
    }

    console.log('valorBonoUti después de la asignación:', this.valorBonoUti);
  });
}

openCreateGMI(): void {
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
        this.obtenerValorGmi();
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

openCreateUTI(): void {
  const dialogRef = this.dialog.open(ValoresBonoUtiCreateComponent, {
    width: '600px',
    data: null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result !== undefined) {
      if (result) {
        this.toastr.success('Valor del Bono Uti agregado con éxito', 'ÉXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.obtenerValorGmi();
      } else {
        this.toastr.error('Ocurrió un error al intentar agregar el valor del Bono Uti', 'Error', {
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
