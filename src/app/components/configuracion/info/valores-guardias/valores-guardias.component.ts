import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ValorGmi } from 'src/app/models/ValorGmi';
import { ValorGmiService } from 'src/app/services/valorGmi.service';
import { ValorBonoUti } from 'src/app/models/ValorBonoUti';
import { ValorBonoUtiService } from 'src/app/services/valorBonoUti.service';
import { ValorGuardiasCargo } from 'src/app/models/ValorGuardiasCargo';
import { ValorGuardiasCargoService } from 'src/app/services/valorGuardiasCargo.service';
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
  valorGmiFechaCargo!: string;
  valorGmiDocumentoLegalCargo!: string;

  valorGmiExtra!: number;
  valorGmiFechaExtra!: string;
  valorGmiDocumentoLegalExtra!: string;

  valorBonoUtiFecha!: string;
  valorBonoUti!: number;

  valorGuardiasCargo!: ValorGuardiasCargo | undefined;
  
  dialogRef!: MatDialogRef<ValoresGuardiasCreateComponent>;
  suscription!: Subscription;

  constructor(
    private valorGmiService: ValorGmiService,
    private valorBonoUtiService: ValorBonoUtiService,
    private valorGuardiasCargoService: ValorGuardiasCargoService, 
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.obtenerValorGmi();
    this.obtenerValorUti();
  }

  obtenerValorGmi() {
    this.valorGmiService.list().subscribe((valores: ValorGmi[]) => {
      valores.forEach(valor => {
        if (typeof valor.fechaInicio === 'string') {
          valor.fechaInicio = new Date(valor.fechaInicio);
        }
        if (valor.fechaFin && typeof valor.fechaFin === 'string') {
          valor.fechaFin = new Date(valor.fechaFin);
        }
      });

      const valoresCARGO = valores.filter(valor => valor.tipoGuardia === 'CARGO');
      const valoresEXTRA = valores.filter(valor => valor.tipoGuardia === 'EXTRA');

      const valorGmiMayorFechaInicioCargo = this.encontrarMayorFechaInicio(valoresCARGO);
      const valorGmiMayorFechaInicioExtra = this.encontrarMayorFechaInicio(valoresEXTRA);

      if (valorGmiMayorFechaInicioCargo) {
        this.valorGmiCargo = valorGmiMayorFechaInicioCargo.monto;

        const fechaCargo = moment(valorGmiMayorFechaInicioCargo.fechaInicio);
        const mesCargo = fechaCargo.format('MMMM').toUpperCase();
        const añoCargo = fechaCargo.format('YYYY');
        this.valorGmiFechaCargo = `${mesCargo}/${añoCargo}`;
        
        this.valorGmiDocumentoLegalCargo = valorGmiMayorFechaInicioCargo.documentoLegal;
      } else {
        this.valorGmiCargo = 0;
        this.valorGmiFechaCargo = '';
        this.valorGmiDocumentoLegalCargo = '';
      }

      if (valorGmiMayorFechaInicioExtra) {
        this.valorGmiExtra = valorGmiMayorFechaInicioExtra.monto;

        const fechaExtra = moment(valorGmiMayorFechaInicioExtra.fechaInicio);
        const mesExtra = fechaExtra.format('MMMM').toUpperCase();
        const añoExtra = fechaExtra.format('YYYY');
        this.valorGmiFechaExtra = `${mesExtra}/${añoExtra}`;
        
        this.valorGmiDocumentoLegalExtra = valorGmiMayorFechaInicioExtra.documentoLegal;
      } else {
        this.valorGmiExtra = 0;
        this.valorGmiFechaExtra = '';
        this.valorGmiDocumentoLegalExtra = '';
      }
    }, error => {
      console.error('Error al obtener los datos de ValorGmi', error);
    });
  }

  private encontrarMayorFechaInicio(valores: ValorGmi[]): ValorGmi | undefined {
    return valores.sort((a, b) => b.fechaInicio.getTime() - a.fechaInicio.getTime())[0];
  }

  obtenerValorUti() {
    this.valorBonoUtiService.list().subscribe((valores: ValorBonoUti[]) => {
      let valorUtiMayorFechaInicio: ValorBonoUti | undefined;

      valores.forEach(valor => {
        const fechaInicio = moment(valor.fechaInicio);

        if (!valorUtiMayorFechaInicio || fechaInicio.isAfter(moment(valorUtiMayorFechaInicio.fechaInicio))) {
          valorUtiMayorFechaInicio = valor;
        }
      });

      if (valorUtiMayorFechaInicio) {
        this.valorBonoUti = valorUtiMayorFechaInicio.monto;
      } else {
        this.valorBonoUti = 0;
      }
    }, error => {
      console.error('Error al obtener los datos de ValorBonoUti', error);
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
