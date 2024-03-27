import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.css']
})
export class PersonDetailComponent implements OnInit {

  person!: Asistencial;

  constructor(
    private dialogRef: MatDialogRef<PersonDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Asistencial 
  ) { }

  ngOnInit(): void {
    this.person = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}