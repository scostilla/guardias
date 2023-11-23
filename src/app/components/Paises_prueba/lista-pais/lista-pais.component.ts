import { Component, OnInit } from '@angular/core';
import { Paises } from '../../../models/paises';
import { PaisesService } from '../../../services/paises.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista-pais',
  templateUrl: './lista-pais.component.html',
  styleUrls: ['./lista-pais.component.css']
})
export class ListaPaisComponent implements OnInit {

  paises: Paises[] = [];
  router: any;

  constructor(
    private paisesService: PaisesService,
    private toastr: ToastrService,
    ) {}

  ngOnInit() {
    this.cargarPaises();
  }

  cargarPaises(): void {
    this.paisesService.lista().subscribe(
      data => {
        this.paises = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  borrar(id: number) {
    this.paisesService.delete(id).subscribe(
      data=> {
        this.toastr.success('Pais eliminado', 'OK', {
          timeOut: 5000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/'])
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Fail', {
          timeOut: 5000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/lista-pais'])
      }
    );
  }

}