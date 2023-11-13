import { Component, OnInit } from '@angular/core';
import { Paises } from '../../../models/paises';
import { PaisesService } from '../../../services/paises.service';

@Component({
  selector: 'app-lista-pais',
  templateUrl: './lista-pais.component.html',
  styleUrls: ['./lista-pais.component.css']
})
export class ListaPaisComponent implements OnInit {

  paises: Paises[] = [];

  constructor(private paisesService: PaisesService) {}

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
    )
  }

}
