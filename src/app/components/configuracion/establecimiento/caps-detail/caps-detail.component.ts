import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Caps } from 'src/app/models/Configuracion/Caps';

@Component({
  selector: 'app-caps-detail',
  templateUrl: './caps-detail.component.html',
  styleUrls: ['./caps-detail.component.css']
})
export class CapsDetailComponent implements OnInit {

  caps!: Caps;

  constructor(
    private dialogRef: MatDialogRef<CapsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Caps 
  ) { }

  ngOnInit(): void {
    this.caps = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}