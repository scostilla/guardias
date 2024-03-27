import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ministerio } from 'src/app/models/Configuracion/Ministerio';

@Component({
  selector: 'app-ministerio-detail',
  templateUrl: './ministerio-detail.component.html',
  styleUrls: ['./ministerio-detail.component.css']
})
export class MinisterioDetailComponent implements OnInit {

  ministerio!: Ministerio;

  constructor(
    private dialogRef: MatDialogRef<MinisterioDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Ministerio 
  ) { }

  ngOnInit(): void {
    this.ministerio = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}