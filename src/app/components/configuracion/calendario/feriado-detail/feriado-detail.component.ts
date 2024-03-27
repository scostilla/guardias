import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Feriado } from 'src/app/models/Configuracion/Feriado';

@Component({
  selector: 'app-feriado-detail',
  templateUrl: './feriado-detail.component.html',
  styleUrls: ['./feriado-detail.component.css']
})
export class FeriadoDetailComponent implements OnInit {

  feriado!: Feriado;

  constructor(
    private dialogRef: MatDialogRef<FeriadoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Feriado 
  ) { }

  ngOnInit(): void {
    this.feriado = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}