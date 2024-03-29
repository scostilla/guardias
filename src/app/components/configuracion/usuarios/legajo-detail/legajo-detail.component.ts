import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Legajo } from 'src/app/models/Configuracion/Legajo';

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

  cerrar(): void {
    this.dialogRef.close();
  }

}