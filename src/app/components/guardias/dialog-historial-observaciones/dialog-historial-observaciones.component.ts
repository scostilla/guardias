import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObservacionDdjjService } from 'src/app/services/observacionDdjj.service';
import { MatTableDataSource } from '@angular/material/table';
import { ObservacionDdjjUltimoDto } from 'src/app/dto/ObservacionDdjjUltimoDto';

@Component({
  selector: 'app-dialog-historial-observaciones',
  templateUrl: './dialog-historial-observaciones.component.html',
  styleUrls: ['./dialog-historial-observaciones.component.css']
})
export class DialogHistorialObservacionesComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'usuario', 'mensaje'];
  dataSource: MatTableDataSource<ObservacionDdjjUltimoDto> = new MatTableDataSource();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { idDdjj: number, tipoDph: boolean },
    private observacionDdjjService: ObservacionDdjjService
  ) {}

  ngOnInit(): void {
    this.observacionDdjjService.getObservacionesActivasPorDdjjYTipoDph(this.data.idDdjj, this.data.tipoDph)
      .subscribe({
        next: (obs) => this.dataSource.data = obs,
        error: () => this.dataSource.data = []
      });
  }
}