import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Region } from 'src/app/models/Configuracion/Region';

@Component({
  selector: 'app-region-detail',
  templateUrl: './region-detail.component.html',
  styleUrls: ['./region-detail.component.css']
})
export class RegionDetailComponent implements OnInit {

  region!: Region;

  constructor(
    private dialogRef: MatDialogRef<RegionDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Region 
  ) { }

  ngOnInit(): void {
    this.region = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}