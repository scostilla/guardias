import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { Efector } from 'src/app/models/Configuracion/Efector'; 

@Component({
  selector: 'app-legajo-detail',
  templateUrl: './legajo-detail.component.html',
  styleUrls: ['./legajo-detail.component.css']
})
export class LegajoDetailComponent implements OnInit {

  legajo!: Legajo;

  constructor(
    private dialogRef: MatDialogRef<LegajoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Legajo 
  ) { }

  ngOnInit(): void {
    this.legajo = this.data;
  }

  isLast(index: number, array: Efector[]): boolean {
    return index === array.length - 1;
}

  cerrar(): void {
    this.dialogRef.close();
  }

}