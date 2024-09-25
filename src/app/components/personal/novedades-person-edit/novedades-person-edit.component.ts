import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NovedadPersonalDto } from 'src/app/dto/personal/NovedadPersonalDto';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { Articulo } from 'src/app/models/Configuracion/Articulo';
import { ArticuloService } from 'src/app/services/Configuracion/articulo.service';
import { Inciso } from 'src/app/models/Configuracion/Inciso';
import { IncisoService } from 'src/app/services/Configuracion/inciso.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-novedades-person-edit',
  templateUrl: './novedades-person-edit.component.html',
  styleUrls: ['./novedades-person-edit.component.css']
})
export class NovedadesPersonEditComponent implements OnInit {
  novedadPersonalForm!: FormGroup;
  initialData: any;
  asistenciales: Asistencial[] = [];
  articulos: Articulo[] = [];
  incisos: Inciso[] = [];
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NovedadesPersonEditComponent>,
    private novedadPersonalService: NovedadPersonalService,
    private asistencialService: AsistencialService,
    private articuloService: ArticuloService,
    private incisoService: IncisoService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { asistencialId: number; novedadPersonal?: NovedadPersonalDto }
  ) {
    this.novedadPersonalForm = this.fb.group({
      descripcion: ['', [Validators.required]],
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      idSuplente: ['', Validators.required],
      idArticulo: ['', Validators.required],
      idInciso: ['', Validators.required],
      puedeRealizarGuardia: [''],
      cobraSueldo: [''],
      necesitaReemplazo: [''],
      actual: [''],
    });

    this.listAsistencial();
    this.listArticulo();
    this.listInciso();

    if (data) {
      this.novedadPersonalForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    if (this.data.novedadPersonal) {
      this.novedadPersonalForm.patchValue({
        descripcion: this.data.novedadPersonal.descripcion,
        fechaInicio: this.data.novedadPersonal.fechaInicio,
        fechaFinal: this.data.novedadPersonal.fechaFinal,
        idSuplente: this.data.novedadPersonal.idSuplente,
        idArticulo: this.data.novedadPersonal.idArticulo,
        idInciso: this.data.novedadPersonal.idInciso,
        puedeRealizarGuardia: this.data.novedadPersonal.puedeRealizarGuardia,
        cobraSueldo: this.data.novedadPersonal.cobraSueldo,
        necesitaReemplazo: this.data.novedadPersonal.necesitaReemplazo,
        actual: this.data.novedadPersonal.actual,
      });
    }
    this.initialData = this.novedadPersonalForm.value;
}

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.novedadPersonalForm.value);
  }

  listAsistencial(): void {
    this.asistencialService.list().subscribe(data => {
      this.asistenciales = data;
    }, error => {
      console.log(error);
    });
  }

  listArticulo(): void {
    this.articuloService.list().subscribe(data => {
      this.articulos = data;
    }, error => {
      console.log(error);
    });
  }

  listInciso(): void {
    this.incisoService.list().subscribe(data => {
      this.incisos = data;
    }, error => {
      console.log(error);
    });
  }

  saveNovedadPersonal(): void {
    if (this.novedadPersonalForm.valid) {
      const formValue = this.novedadPersonalForm.value;
  
      const novedadPersonalDto = new NovedadPersonalDto(
        formValue.fechaInicio,
        formValue.fechaFinal,
        formValue.puedeRealizarGuardia,
        formValue.cobraSueldo,
        formValue.necesitaReemplazo,
        formValue.actual,
        formValue.descripcion,
        this.data.novedadPersonal ? this.data.novedadPersonal.idPersona : this.data.asistencialId,
        formValue.idSuplente,
        formValue.idArticulo,
        formValue.idInciso,
      );
      console.log('Datos a guardar:', novedadPersonalDto);

      if (this.data.novedadPersonal && this.data.novedadPersonal.id) {
        this.novedadPersonalService.update(this.data.novedadPersonal.id, novedadPersonalDto).subscribe(
          result => {
            console.log('Novedad actualizada:', result);
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            console.error('Error al actualizar la novedad:', error);
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        this.novedadPersonalService.save(novedadPersonalDto).subscribe(
          result => {
            console.log('Novedad creada:', result);
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            console.error('Error al crear la novedad:', error);
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      }
    }
  }

  compareAsistencial(p1: Asistencial, p2: Asistencial): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareArticulo(p1: Articulo, p2: Articulo): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareInciso(p1: Inciso, p2: Inciso): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancel(): void {
    this.dialogRef.close();
  }
}