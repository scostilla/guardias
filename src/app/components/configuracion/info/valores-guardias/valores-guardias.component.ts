import { Component, OnInit } from '@angular/core';
import { ValorGmi } from 'src/app/models/ValorGmi';
import { ValorGmiService } from 'src/app/services/valorGmi.service';

@Component({
  selector: 'app-valores-guardias',
  templateUrl: './valores-guardias.component.html',
  styleUrls: ['./valores-guardias.component.css']
})
export class ValoresGuardiasComponent implements OnInit {
  valorGmiCargo!: number;
  valorGmiLV!: number;
  valorGmiSDF!: number;
  valorB1580LV = 16801.63;
  valorB1580SDF = 18481.79;

  constructor(private valorGmiService: ValorGmiService) { }

  ngOnInit(): void {
    this.obtenerValorGmi();
  }

  obtenerValorGmi() {
    this.valorGmiService.list().subscribe((valores: ValorGmi[]) => {
      let valorGmiMayorFechaInicio: ValorGmi;

      valores.forEach(valor => {
        if (!valorGmiMayorFechaInicio || valor.fechaInicio > valorGmiMayorFechaInicio.fechaInicio) {
          valorGmiMayorFechaInicio = valor;
        }
      });

      if (valorGmiMayorFechaInicio!) {
        this.valorGmiCargo = valorGmiMayorFechaInicio.monto;
        this.valorGmiLV = this.valorGmiCargo * 2;
        this.valorGmiSDF = this.valorGmiLV * 1.10;
      } else {
        this.valorGmiCargo = 0;
        this.valorGmiLV = 0;
        this.valorGmiSDF = 0;
      }
    });
  }
}