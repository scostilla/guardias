import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../services/Servicio/servicio.service';
import { Servicio } from '../models/servicio';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-servicio',
  templateUrl: './nuevo-servicio.component.html',
  styleUrls: ['./nuevo-servicio.component.css']
})
export class NuevoServicioComponent implements OnInit {

  descripcion ="";

  constructor(
    private servicioService: ServicioService,
    private toastr: ToastrService,
    private router : Router
    
    ){}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onCreate():void{
    const servicio= new Servicio(this.descripcion);
    this.servicioService.save(servicio).subscribe(
      data => {
        this.toastr.success('Servicio creado', 'OK',{
          timeOut:3000, positionClass:'toast-top-center',
        });
        this.router.navigate(['/']);
      },
      err => {
        this.toastr.error(err.error.mensaje,'fail',{
          timeOut:3000, positionClass:'toast-top-center',
        });
        this.router.navigate(['/']);
      }
    )
  }

}
