import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Articulo } from 'src/app/models/Configuracion/Articulo';

@Component({
  selector: 'app-articulo-detail',
  templateUrl: './articulo-detail.component.html',
  styleUrls: ['./articulo-detail.component.css']
})
export class ArticuloDetailComponent implements OnInit {

  articulo!: Articulo;
  
  constructor(
    private dialogRef: MatDialogRef<ArticuloDetailComponent>,
   @Inject(MAT_DIALOG_DATA) private data: Articulo
  ) { }

  ngOnInit(): void {
    this.articulo = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}

 