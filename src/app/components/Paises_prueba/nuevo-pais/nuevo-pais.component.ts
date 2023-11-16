import { Component, OnInit } from '@angular/core';
import { PaisesService } from '../../../services/paises.service';
import { Paises } from '../../../models/paises';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nuevo-pais',
  templateUrl: './nuevo-pais.component.html',
  styleUrls: ['./nuevo-pais.component.css']
})
export class NuevoPaisComponent implements OnInit{

  codigo: string = '';
  nacionalidad: string = '';
  nombre: string = '';

  constructor(
    private paisesService: PaisesService,
    private toastr: ToastrService,
    private router: Router
    ) {}

  ngOnInit() {
    
  }

  onCreate(): void {
    const pais = new Paises(this.codigo, this.nacionalidad, this.nombre);
    this.paisesService.save(pais).subscribe(
      data=> {
        this.toastr.success('Pais Creado', 'OK', {
          timeOut: 3000
        });
        this.router.navigate(['/lista-pais']);
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Fail', {
          timeOut: 3000
        });
        this.router.navigate(['/lista-pais']);
      }
    )

  }
}
