import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Provincia } from 'src/app/models/Provincia';

@Component({
  selector: 'app-provincia-detail',
  templateUrl: './provincia-detail.component.html',
  styleUrls: ['./provincia-detail.component.css']
})
export class ProvinciaDetailComponent implements OnInit {

  provincia!: Provincia;

  constructor(
    private dialogRef: MatDialogRef<ProvinciaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Provincia 
  ) { }

  ngOnInit(): void {
    this.provincia = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}