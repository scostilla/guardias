/* import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { Articulo } from 'src/app/models/Configuracion/Articulo';
import { TipoLey } from 'src/app/models/Configuracion/TipoLey';
import { ArticuloService } from 'src/app/services/Configuracion/articulo.service';
import { TipoLeyService } from 'src/app/services/Configuracion/tipoLey.service';
@Component({
  selector: 'app-articulo-edit',
  templateUrl: './articulo-edit.component.html',
  styleUrls: ['./articulo-edit.component.css']
})
export class ArticuloEditComponent implements OnInit{

 articuloForm: FormGroup;
 initialData: any;
 tipoLey: TipoLey[] = [];
 articuloPadre: Articulo[] = [];

  constructor(
    private fb: FormBuilder,
    private articuloService: ArticuloService,
    public dialogRef: MatDialogRef<ArticuloEditComponent>,
    private tipoLeyService: TipoLeyService,
    @Inject(MAT_DIALOG_DATA) public data: Articulo

  ) { 
    this.articuloForm = this.fb.group({
        numero : ['', Validators.required],
        denominacion : ['', Validators.required],
        detalle: ['', Validators.required],
        estado : ['', Validators.required],
        fechaAlta : ['', Validators.required],
        fechaModificacion : ['', Validators.required],
        motivoModificacion : ['', Validators.required],
        tipoLey : ['', Validators.required],
        });

    }

} */