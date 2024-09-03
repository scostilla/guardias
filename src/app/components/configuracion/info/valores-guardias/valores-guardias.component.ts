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
import { Subscription, forkJoin } from 'rxjs';
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

@Component({
  selector: 'app-valores-guardias',
  templateUrl: './valores-guardias.component.html',
  styleUrls: ['./valores-guardias.component.css']
})
export class ValoresGuardiasComponent implements OnInit, OnDestroy {
  valoresPorNivel: { [nivel: number]: ValorGuardiasCargo[] } = {};
  
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
    this.listCargo();

    this.suscription = this.valorGuardiasCargoService.refresh$.subscribe(() => {
      this.listCargo();
    })

  }

  listCargo(): void {
    this.suscription = this.valorGuardiasCargoService.obtenerValorGuardiaCargo().subscribe(
      (data: { [nivel: number]: ValorGuardiasCargo[] }) => {
        this.valoresPorNivel = data;
      },
      error => {
        console.error('Error al obtener el valor de guardia cargo', error);
      }
    );
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
          this.listCargo();
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
          this.listCargo();
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
