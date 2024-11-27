import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';


@Component({
  selector: 'app-asistencial-detail',
  templateUrl: './asistencial-detail.component.html',
  styleUrls: ['./asistencial-detail.component.css']
})
export class AsistencialDetailComponent implements OnInit {

  asistencial!: Asistencial;

  constructor(
    private dialogRef: MatDialogRef<AsistencialDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Asistencial 
  ) { }

  ngOnInit(): void {
    this.asistencial = this.data;
  }

  isLast(index: number, array: TipoGuardia[]): boolean {
    return index === array.length - 1;
  }

  formatCuil(cuil: string): string {
    if (!cuil) return '';
    if (cuil.length < 11) return cuil;
    
    return `${cuil.slice(0, 2)}-${cuil.slice(2, 10)}-${cuil.slice(10)}`;
  }


  cerrar(): void {
    this.dialogRef.close();
  }

}