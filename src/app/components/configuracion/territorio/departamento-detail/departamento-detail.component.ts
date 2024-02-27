import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Departamento } from 'src/app/models/Departamento';

@Component({
  selector: 'app-departamento-detail',
  templateUrl: './departamento-detail.component.html',
  styleUrls: ['./departamento-detail.component.css']
})
export class DepartamentoDetailComponent implements OnInit {

  departamento!: Departamento;

  constructor(
    private dialogRef: MatDialogRef<DepartamentoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Departamento 
  ) { }

  ngOnInit(): void {
    this.departamento = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}