import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Profesion } from 'src/app/models/Profesion';

@Component({
  selector: 'app-profesion-detail',
  templateUrl: './profesion-detail.component.html',
  styleUrls: ['./profesion-detail.component.css']
})
export class ProfesionDetailComponent implements OnInit {

  profesion!: Profesion;

  constructor(
    private dialogRef: MatDialogRef<ProfesionDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Profesion 
  ) { }

  ngOnInit(): void {
    this.profesion = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}