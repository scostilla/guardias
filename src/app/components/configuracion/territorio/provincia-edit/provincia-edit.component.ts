import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pais } from 'src/app/models/Pais';
import { Provincia } from 'src/app/models/Provincia';
import { PaisService } from 'src/app/services/pais.service';
import { ProvinciaService } from 'src/app/services/provincia.service';


@Component({
  selector: 'app-provincia-edit',
  templateUrl: './provincia-edit.component.html',
  styleUrls: ['./provincia-edit.component.css'],
})
export class ProvinciaEditComponent implements OnInit {
  provincia?: Provincia;
  paises: Pais[] = [];
  paisEncontrado?: Pais;
  gentilicio: string = '';
  nombre: string = '';
  id_pais?: number;
  pais?: Pais;
  id?: number;


  constructor(
    private provinciaService: ProvinciaService,
    private paisService: PaisService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<ProvinciaEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit() {
    this.id = this.data.id; 
    this.paisService.lista().subscribe((data: Pais[]) => {
      this.paises = data;
    });
  if (this.id === -1){
    this.onCreate();
  }else{
    this.provinciaService.detalle(this.id).subscribe(
      (data) => {
        this.provincia = data;
        this.provincia.pais.id = data.pais.id;
      },
      (err) => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
        });
      }
    );
    this.paisService.lista().subscribe((data: Pais[]) => {
      this.paises = data;
      console.log(this.paises);
    });
  }
  }

  paisChange() {
    if (this.provincia) {
      const nombre = this.provincia.pais.nombre;
      this.paisEncontrado = this.paises.find((pais) => pais.nombre === nombre);
    }
  }

  onUpdate(): void {
    const id = this.data.id;

    console.log('onUpdate ' + id);
    if (this.provincia) {
      this.provincia.pais = this.paisEncontrado ? this.paisEncontrado : this.provincia.pais;
      this.provinciaService.update(id, this.provincia).subscribe(
        (data) => {
          this.toastr.success('Provincia Modificado', 'OK', {
            timeOut: 7000,
            positionClass: 'toast-top-center',
          });
        },
        (err) => {
          this.toastr.error(err.error.mensaje, 'Error', {
            timeOut: 7000,
            positionClass: 'toast-top-center',
          });
        }
      );
    }

    this.dialogRef.close();
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
