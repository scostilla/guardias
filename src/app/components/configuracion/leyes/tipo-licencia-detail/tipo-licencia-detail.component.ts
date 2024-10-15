import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoLicencia } from "src/app/models/Configuracion/TipoLicencia";

@Component({
    selector: 'app-tipo-licencia-detail',
    templateUrl: './tipo-licencia-detail.component.html',
    styleUrls: ['./tipo-licencia-detail.component.css']
})
export class TipoLicenciaDetailComponent implements OnInit {

    tipoLicencia!: TipoLicencia;

    constructor(
        private dialogRef: MatDialogRef<TipoLicenciaDetailComponent>,
        @Inject(MAT_DIALOG_DATA) private data: TipoLicencia
    ){ }

    ngOnInit(): void {
        this.tipoLicencia = this.data;
    }

    cerrar(): void {
        this.dialogRef.close();
    }


}