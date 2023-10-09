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

export interface DialogData {
  observ: string;
}

@Component({
  selector: 'app-ddjj-extra',
  templateUrl: './ddjj-extra.component.html',
  styleUrls: ['./ddjj-extra.component.css'],
})
export class DdjjExtraComponent {
  displayedColumns = [
    'position',
    'servicio',
    'nya',
    'cuil',
    'vinculo',
    'categoria',
    'novedades',
  ];

  profesionales: any[] = [];
  enableTotales: boolean = false;
  enableAprobada: boolean = false;
  enableRechazada: boolean = false;
  estado: string = 'pendiente';
  horasSemanal: number = 0;
  horasFindeSemana: number = 0;
  observ!: string;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit() {
    this.enableTotales = false;
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

  btnPaseDPH() {
    this.enableTotales = true;

    if (this.profesionales) {
      for (let i = 0; i < this.profesionales.length; i++) {
        if (this.profesionales[i].extraLunes) {
          this.horasSemanal = +this.profesionales[i].extraLunes;
        }
        if (this.profesionales[i].extraMartes) {
          this.horasSemanal = +this.profesionales[i].extraMartes;
        }
        if (this.profesionales[i].extraMiercoles) {
          this.horasSemanal = +this.profesionales[i].extraMiercoles;
        }
        if (this.profesionales[i].extraJueves) {
          this.horasSemanal = +this.profesionales[i].extraJueves;
        }
        if (this.profesionales[i].extraViernes) {
          this.horasSemanal = +this.profesionales[i].extraViernes;
        }

        if (this.profesionales[i].extraSabado) {
          this.horasFindeSemana = +this.profesionales[i].extraSabado;
        }
        if (this.profesionales[i].extraDomingo) {
          this.horasFindeSemana = +this.profesionales[i].extraDomingo;
        }

        //SOLO PARA ESTER MES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //MULTIPLICO *4 MARTES A VIERNES Y *5 FINDE Y LUNES
        this.profesionales[i].horasSemanal =
          this.horasSemanal * 4 + this.profesionales[i].extraLunes || 0;
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
