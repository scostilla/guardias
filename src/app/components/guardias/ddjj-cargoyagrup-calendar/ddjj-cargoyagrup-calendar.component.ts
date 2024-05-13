import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegistroMensual } from 'src/app/models/RegistroMensual';

@Component({
  selector: 'app-ddjj-cargoyagrup-calendar',
  templateUrl: './ddjj-cargoyagrup-calendar.component.html',
  styleUrls: ['./ddjj-cargoyagrup-calendar.component.css']
})
export class DdjjCargoyagrupCalendarComponent implements OnInit {
  registroMensual!: RegistroMensual;

  constructor(
    public dialogRef: MatDialogRef<DdjjCargoyagrupCalendarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegistroMensual // Cambia el tipo de data a RegistroMensual
  ) {}

  ngOnInit(): void {
    // Asigna los datos recibidos a registroMensual
    this.registroMensual = this.data;
  }
  
  cerrar(): void {
    this.dialogRef.close();
  }
}