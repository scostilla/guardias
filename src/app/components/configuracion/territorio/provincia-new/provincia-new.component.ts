import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pais } from 'src/app/models/Pais';
import { PaisService } from 'src/app/services/pais.service';
import { Provincia } from 'src/app/models/Provincia';
import { ProvinciaService } from 'src/app/services/provincia.service';

@Component({
  selector: 'app-provincia-new',
  templateUrl: './provincia-new.component.html',
  styleUrls: ['./provincia-new.component.css']
})

export class ProvinciaNewComponent implements OnInit {
  gentilicio: string = '';
  nombre: string = '';
  id_pais?: number;
  pais?: Pais;
  provincia?: Provincia;
  paises: Pais[] = [];

  constructor(
    private provinciaService: ProvinciaService,
    private paisService: PaisService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<ProvinciaNewComponent>,
    ) {}

  ngOnInit() {
    this.paisService.lista().subscribe((data: Pais[]) => {
      this.paises = data;
    });
  }


  onCreate(): void {
    if (this.id_pais) {
      this.paisService.detalle(this.id_pais).subscribe(
        pais => {
          this.provincia = new Provincia(this.gentilicio, this.nombre, pais);
          this.provinciaService.save(this.provincia).subscribe(
            data => {
              this.toastr.success('Provincia Agregada', 'OK', {
                timeOut: 6000, positionClass: 'toast-top-center'
              });
            },
            err => {
              this.toastr.error(err.error.mensaje, 'Error', {
                timeOut: 7000, positionClass: 'toast-top-center'
              });
            }
          );
        },
        error => {
          console.error('Error al obtener el detalle del país:', error);
        }
      );
    }
  }


  cancel() {
    this.dialogRef.close();
  }

}
