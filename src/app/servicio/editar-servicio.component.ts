import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Servicio } from '../models/servicio';
import { ServicioService } from '../services/Servicio/servicio.service';

@Component({
  selector: 'app-editar-servicio',
  templateUrl: './editar-servicio.component.html',
  styleUrls: ['./editar-servicio.component.css']
})
export class EditarServicioComponent implements OnInit{


  servicio: Servicio = new Servicio("");
  servicioAux: any;

  constructor(
    private servicioService: ServicioService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) { }


  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.servicioService.detail(id).subscribe(
      data => {
        this.servicio = data;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Fail', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        this.router.navigate(['/']);
      }
    );
  }


  onUpdate(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.servicioService.update(id, this.servicio).subscribe(
      data => {
        this.toastr.success('Producto Actualizado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/']);
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Fail', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        this.router.navigate(['/']);
      }
    );
  }

}
