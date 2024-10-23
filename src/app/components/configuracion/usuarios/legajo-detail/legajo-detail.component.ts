import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Especialidad } from 'src/app/models/Configuracion/Especialidad';
import { Revista } from 'src/app/models/Configuracion/Revista';


@Component({
  selector: 'app-legajo-detail',
  templateUrl: './legajo-detail.component.html',
  styleUrls: ['./legajo-detail.component.css']
})
export class LegajoDetailComponent implements OnInit {

  legajo!: Legajo;
  revista!: Revista;

  constructor(
    private dialogRef: MatDialogRef<LegajoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Legajo 
  ) { }

  ngOnInit(): void {
    this.legajo = this.data;
    this.revista = this.legajo.revista;
  }

  isLast(index: number, array: Efector[] | Especialidad[]): boolean {
    return index === array.length - 1;
  }
  
  cerrar(): void {
    this.dialogRef.close();
  }

}