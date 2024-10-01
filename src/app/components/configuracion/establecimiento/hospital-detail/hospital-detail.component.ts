import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Hospital } from 'src/app/models/Configuracion/Hospital';

@Component({
  selector: 'app-hospital-detail',
  templateUrl: './hospital-detail.component.html',
  styleUrls: ['./hospital-detail.component.css']
})
export class HospitalDetailComponent implements OnInit {

  hospital!: Hospital;

  constructor(
    private dialogRef: MatDialogRef<HospitalDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Hospital 
  ) { }

  ngOnInit(): void {
    this.hospital = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}