import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NovedadPersonalDto } from 'src/app/dto/personal/NovedadPersonalDto';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialSelectorComponent } from 'src/app/components/configuracion/usuarios/asistencial-selector/asistencial-selector.component';
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
  inputValue: string = '';
  selectedAsistencial?: Asistencial;

  
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NovedadesPersonEditComponent>,
    private novedadPersonalService: NovedadPersonalService,
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

  openAsistencialDialog(): void {
    const dialogRef = this.dialog.open(AsistencialSelectorComponent, {
      width: '800px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedAsistencial = result;
        this.inputValue = `${result.apellido} ${result.nombre}`;
        this.novedadPersonalForm.patchValue({ idSuplente: result.id });
      } else {
        this.toastr.info('No se seleccionó un profesional', 'Información', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }, error => {
      this.toastr.error('Ocurrió un error al abrir el diálogo de Asistencial', 'Error', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      console.error('Error al abrir el diálogo de carga de profesional:', error);
    });
  }
  


  saveNovedadPersonal(): void {
    if (this.novedadPersonalForm.valid) {
      console.log('Valores del formulario:', this.novedadPersonalForm.value);
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