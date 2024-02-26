import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pais } from 'src/app/models/Pais';

@Component({
  selector: 'app-pais-detail',
  templateUrl: './pais-detail.component.html',
  styleUrls: ['./pais-detail.component.css']
})
export class PaisDetailComponent implements OnInit {

  pais!: Pais;

  constructor(
    private dialogRef: MatDialogRef<PaisDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Pais 
  ) { }

  ngOnInit(): void {
    this.pais = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}