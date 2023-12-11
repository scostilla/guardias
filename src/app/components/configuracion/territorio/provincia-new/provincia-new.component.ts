import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pais } from 'src/app/models/Pais';
import { Provincia } from 'src/app/models/Provincia';
import { PaisService } from 'src/app/services/pais.service';
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

  constructor(
    private provinciaService: ProvinciaService,
    private paisService: PaisService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<ProvinciaNewComponent>,

    ) {}

  ngOnInit() {

  }


  onCreate(): void {
    if (this.id_pais) {
      this.paisService.detail(this.id_pais).subscribe(
        pais => {
          this.provincia = new Provincia(this.gentilicio, this.nombre, pais);
          this.provinciaService.save(this.provincia).subscribe(
            data => {
              this.toastr.success('Provincia Agregada', 'OK', {
                timeOut: 6000, positionClass: 'toast-top-center'
              });
              this.router.navigate(['/provincia']);
            },
            err => {
              this.toastr.error(err.error.mensaje, 'Error', {
                timeOut: 7000, positionClass: 'toast-top-center'
              });
              this.router.navigate(['/provincia']);
            }
          );
        },
        error => {
          console.error('Error al obtener el detalle del país:', error);
        }
      );
    }
    this.dialogRef.close();
  }


  cancel() {
    this.dialogRef.close();
  }

}
