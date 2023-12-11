import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Provincia } from 'src/app/models/provincia';
import { ProvinciaService } from 'src/app/services/provincia.service';
import { Pais } from 'src/app/models/pais';
import { PaisService } from 'src/app/services/pais.service';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

export interface UserData {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-provincia-new',
  templateUrl: './provincia-new.component.html',
  styleUrls: ['./provincia-new.component.css']
})

export class ProvinciaNewComponent implements OnInit {
  gentilicio: string = '';
  nombre: string = '';
  idPais?: number;

  paises: Pais[] = [];
  displayedColumns: string[] = ['id', 'nombre'];
  dataSource: UserData[] = [];

  constructor(
    private ProvinciaService: ProvinciaService,
    private paisService: PaisService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<ProvinciaNewComponent>,

    ) {}

  ngOnInit(): void {
    this.cargarPaises();
  }

  cargarPaises(): void {
    this.paisService.lista().subscribe(
      (data: Pais[]) => {
        const userDataArray: UserData[] = data.map(pais => ({
          id: pais.id || 0,
          nombre: pais.nombre || '',
        }));

        this.dataSource = userDataArray;
      },
      (err) => {
        console.log(err);
      }
    );
  }


  onCreate(): void {
    if(this.idPais)
    {
      const provincia = new Provincia(this.gentilicio, this.nombre, this.idPais);
      this.ProvinciaService.save(provincia).subscribe(
        data=> {
          this.toastr.success('Provincia Agregada', 'OK', {
            timeOut: 6000, positionClass: 'toast-top-center'
          });
          this.router.navigate(['/provincia'])
        },
        err => {
          this.toastr.error(err.error.mensaje, 'Error', {
            timeOut: 7000, positionClass: 'toast-top-center'
          });
          this.router.navigate(['/provincia'])
        }
      )
    }
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

}
