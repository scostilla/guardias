import { Component, OnInit } from '@angular/core';
import { PaisService } from 'src/app/services/pais.service';
import { ToastrService } from 'ngx-toastr';
import { Pais } from 'src/app/models/pais';
import {
  MatDialog,
} from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  styleUrls: ['./provincia.component.css']
})
export class ProvinciaComponent implements OnInit {

  paises: Pais[] = [];
  router: any;

  constructor(
    private paisService: PaisService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    ) {}

  ngOnInit() {
    this.cargarPaises();
  }

  cargarPaises(): void {
    this.paisService.lista().subscribe(
      data => {
        this.paises = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ProvinciaComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  borrar(id: number, nombre: string) {
    this.dialog
    .open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + nombre,
        title: 'Eliminar',
      },
    })
    .afterClosed()
    .subscribe((confirm: Boolean) => {
      if (confirm) {

    this.paisService.delete(id).subscribe(
      data=> {
        this.toastr.success('Pais eliminado', 'OK', {
          timeOut: 5000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/pais'])
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Fail', {
          timeOut: 5000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/pais'])
      }
    );
  } else {
    this.dialog.closeAll();
  }
});
  }

}