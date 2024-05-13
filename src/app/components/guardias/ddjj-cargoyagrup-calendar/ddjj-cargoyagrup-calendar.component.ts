import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegistroActividad } from 'src/app/models/RegistroActividad';

@Component({
  selector: 'app-ddjj-cargoyagrup-calendar',
  templateUrl: './ddjj-cargoyagrup-calendar.component.html',
  styleUrls: ['./ddjj-cargoyagrup-calendar.component.css']
})
export class DdjjCargoyagrupCalendarComponent implements OnInit {
  registroActividad!: RegistroActividad;

  constructor(
    public dialogRef: MatDialogRef<DdjjCargoyagrupCalendarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegistroActividad
  ) {}

  ngOnInit(): void {
    this.registroActividad = this.data;
  }
  
  cerrar(): void {
    this.dialogRef.close();
  }

}