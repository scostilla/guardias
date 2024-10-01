import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NovedadPersonal } from 'src/app/models/personal/NovedadPersonal';

@Component({
  selector: 'app-novedades-person-detail',
  templateUrl: './novedades-person-detail.component.html',
  styleUrls: ['./novedades-person-detail.component.css']
})
export class NovedadesPersonDetailComponent implements OnInit {

  novedadPeronal!: NovedadPersonal;

  constructor(
    private dialogRef: MatDialogRef<NovedadesPersonDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: NovedadPersonal 
  ) { }

  ngOnInit(): void {
    this.novedadPeronal = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}