import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { PopupCalendarioComponent } from '../popup-calendario/popup-calendario.component';

export interface DialogData {
  observ: string;
}

@Component({
  selector: 'app-ddjj-cargoyagrup',
  templateUrl: './ddjj-cargoyagrup.component.html',
  styleUrls: ['./ddjj-cargoyagrup.component.css'],
})
export class DdjjCargoyagrupComponent {
  /* date = '2023-07-21T13:59:31.238Z';  */

  profesionales: any[] = [];
  enableTotales: boolean = false;
  enableAprobada: boolean = false;
  enableRechazada: boolean = false;
  estado: string = 'pendiente';
  horasSemanal: number = 0;
  horasFindeSemana: number = 0;
  observ!: string;
  today: number = new Date(2023, 7, 0).getDate(); //31
  numberOfMonth: Array<number> = new Array<number>();

  daysOfMonth: Array<Date> = new Array<Date>();

  constructor(
    public dialog: MatDialog,
    public dialogReg: MatDialog,
    private route: ActivatedRoute
  ) {
    for (var dia = 1; dia <= this.today; dia++) {
      this.numberOfMonth.push(dia);
    }

    for (var di = 1; di <= this.numberOfMonth.length; di++) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const especificDate = new Date(year, month, di);
      this.daysOfMonth.push(especificDate);
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['vector']) {
        this.profesionales = JSON.parse(params['vector']);
        console.log(this.profesionales);
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogObserv, {
      data: { observ: this.observ },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.observ = result;
    });
  }

  openPopupCalendario() {
    this.dialogReg.open(PopupCalendarioComponent, {
      width: '600px',
      disableClose: true,
    });
  }

  btnPaseDPH() {
    this.enableTotales = true;

    if (this.profesionales) {
      for (let i = 0; i < this.profesionales.length; i++) {
        this.horasFindeSemana = 0;
        this.horasSemanal = 0;

        if (this.profesionales[i].cargoLunes) {
          this.horasSemanal += +this.profesionales[i].cargoLunes * 2;
        }
        if (this.profesionales[i].agrupacionLunes) {
          this.horasSemanal += +this.profesionales[i].agrupacionLunes * 2;
        }

        if (this.profesionales[i].cargoMartes) {
          this.horasSemanal += +this.profesionales[i].cargoMartes;
        }
        if (this.profesionales[i].agrupacionMartes) {
          this.horasSemanal += +this.profesionales[i].agrupacionMartes;
        }

        if (this.profesionales[i].cargoMiercoles) {
          this.horasSemanal += +this.profesionales[i].cargoMiercoles;
        }
        if (this.profesionales[i].agrupacionMiercoles) {
          this.horasSemanal += +this.profesionales[i].agrupacionMiercoles;
        }

        if (this.profesionales[i].cargoJueves) {
          this.horasSemanal += +this.profesionales[i].cargoJueves;
        }
        if (this.profesionales[i].agrupacionJueves) {
          this.horasSemanal += +this.profesionales[i].agrupacionJueves;
        }

        if (this.profesionales[i].cargoViernes) {
          this.horasSemanal += +this.profesionales[i].cargoViernes;
        }
        if (this.profesionales[i].agrupacionViernes) {
          this.horasSemanal += +this.profesionales[i].agrupacionViernes;
        }

        if (this.profesionales[i].cargoSabado) {
          this.horasFindeSemana += +this.profesionales[i].cargoSabado;
        }
        if (this.profesionales[i].agrupacionSabado) {
          this.horasFindeSemana += +this.profesionales[i].agrupacionSabado;
        }

        if (this.profesionales[i].cargoDomingo) {
          this.horasFindeSemana += +this.profesionales[i].cargoDomingo;
        }
        if (this.profesionales[i].agrupacionDomingo) {
          this.horasFindeSemana += +this.profesionales[i].agrupacionDomingo;
        }

        //SOLO PARA ESTER MES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //MULTIPLICO *4 MARTES A VIERNES Y *5 FINDE Y LUNES
        this.profesionales[i].horasSemanal = this.horasSemanal * 4 || 0;
        this.profesionales[i].horasFindeSemana = this.horasFindeSemana * 5 || 0;
        this.profesionales[i].horasTotal =
          this.profesionales[i].horasSemanal +
          this.profesionales[i].horasFindeSemana;
      }
    }
  }

  btnAprobado() {
    this.enableAprobada = true;
    this.estado = 'aprobado';
  }

  btnRechazado() {
    if (this.observ) {
      this.enableRechazada = true;
      this.estado = 'rechazado';
    } else {
      this.enableRechazada = false;
      this.estado = 'pendiente';
    }
    console.log(this.enableRechazada);
  }
}

@Component({
  selector: 'dialog-observ',
  templateUrl: 'dialog-observ.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class DialogObserv {
  constructor(
    public dialogRef: MatDialogRef<DialogObserv>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
