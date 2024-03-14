import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Feriado } from 'src/app/models/Feriado';
import { FeriadoService } from 'src/app/services/feriado.service';

@Component({
  selector: 'app-feriado-edit',
  templateUrl: './feriado-edit.component.html',
  styleUrls: ['./feriado-edit.component.css']
})
export class FeriadoEditComponent implements OnInit {

  form?: FormGroup;
  esEdicion?: boolean;
  esIgual: boolean = false;

  constructor(
    private fb: FormBuilder,
    private feriadoService: FeriadoService,
    private dialogRef: MatDialogRef<FeriadoEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Feriado 
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data ? this.data.id : null],
      motivo: [this.data ? this.data.motivo : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      fecha: [this.data ? this.data.fecha : '', [Validators.required]],
      tipoFeriado: [this.data ? this.data.tipoFeriado : '', [Validators.required]],
      descripcion: [this.data ? this.data.descripcion : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]]
    });

    this.esEdicion = this.data != null;
    
    this.form.valueChanges.subscribe(val => {
    this.esIgual = val.id !== this.data?.id || val.motivo !== this.data?.motivo || val.fecha !== this.data?.fecha || val.tipoFeriado !== this.data?.tipoFeriado || val.descripcion !== this.data?.descripcion;
    });
  }

  saveFeriado(): void {
    const id = this.form?.get('id')?.value;
    const motivo = this.form?.get('motivo')?.value;
    const fecha = this.form?.get('fecha')?.value;
    const tipoFeriado = this.form?.get('tipoFeriado')?.value;
    const descripcion = this.form?.get('descripcion')?.value;

    const feriado = new Feriado(motivo, fecha, tipoFeriado, descripcion);
    feriado.id = id;

    if (this.esEdicion) {
      this.feriadoService.update(id, feriado).subscribe(data => {
        this.dialogRef.close(data);
      });
    } else {
      this.feriadoService.save(feriado).subscribe(data => {
        this.dialogRef.close(data);
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}