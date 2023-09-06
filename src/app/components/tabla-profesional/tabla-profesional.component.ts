import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Profesional } from 'src/app/models/profesional';
import { ProfesionalService } from 'src/app/services/Servicio/profesional.service';

@Component({
  selector: 'app-tabla-profesional',
  templateUrl: './tabla-profesional.component.html',
  styleUrls: ['./tabla-profesional.component.css']
})
export class TablaProfesionalComponent implements OnInit {

  profesionales: Profesional[]=[];

  constructor(
    private profesionalService: ProfesionalService,
    private toastr: ToastrService,
  ){}

  ngOnInit() {
    this.cargarProfesionales();
  }

  cargarProfesionales(): void {
    this.profesionalService.lista().subscribe(
      data => {
        this.profesionales = data;
      },
      err => {
        console.log(err);
      }
    );
  }

}
