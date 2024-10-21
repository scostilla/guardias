import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';


@Component({
  selector: 'app-no-asistencial-detail',
  templateUrl: './no-asistencial-detail.component.html',
  styleUrls: ['./no-asistencial-detail.component.css']
})

export class NoAsistencialDetailComponent implements OnInit {

  noasistencial!: NoAsistencial;

  constructor(
    private dialogRef: MatDialogRef<NoAsistencialDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: NoAsistencial 
  ) { }

  ngOnInit(): void {
    this.noasistencial = this.data;
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