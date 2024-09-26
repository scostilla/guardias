import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../services/Servicio/servicio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Servicio } from '../models/servicio';

@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.css']
})
export class DetalleServicioComponent implements OnInit{

  servicio: Servicio = new Servicio("");
  
  constructor(
    private servicioService: ServicioService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) { }


  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.servicioService.detail(id).subscribe(
      data => {
        this.servicio = data;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Fail', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        this.volver();
      }
    )
  }

  volver():void{
    this.router.navigate(['/']);
  }
  
}
