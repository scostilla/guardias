import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Autoridad } from 'src/app/models/Configuracion/Autoridad';

@Component({
  selector: 'app-autoridad-detail',
  templateUrl: './autoridad-detail.component.html',
  styleUrls: ['./autoridad-detail.component.css']
})
export class AutoridadDetailComponent implements OnInit {

  autoridad!: Autoridad;

  constructor(
    private dialogRef: MatDialogRef<AutoridadDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Autoridad 
  ){}

  ngOnInit(): void {
    this.autoridad = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}
