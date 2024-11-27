import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Cargo } from "src/app/models/Configuracion/Cargo";


@Component({
  selector: 'app-cargo-detail',
  templateUrl: './cargo-detail.component.html',
  styleUrls: ['./cargo-detail.component.css']
})
export class CargoDetailComponent implements OnInit {

  cargo!: Cargo;


  constructor(
    private dialogRef: MatDialogRef<CargoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Cargo
  ) { }

  ngOnInit(): void {
    this.cargo = this.data;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}
