import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Region } from 'src/app/models/Configuracion/Region';
import { RegionService } from 'src/app/services/Configuracion/region.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-region-edit',
  templateUrl: './region-edit.component.html',
  styleUrls: ['./region-edit.component.css']
})
export class RegionEditComponent implements OnInit {

  form?: FormGroup;
  esEdicion?: boolean;
  esIgual: boolean = false;

  constructor(
    private fb: FormBuilder,
    private regionService: RegionService,
    private dialogRef: MatDialogRef<RegionEditComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data: Region 
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data ? this.data.id : null],
      nombre: [this.data ? this.data.nombre : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,20}$')]]
    });

    this.esEdicion = this.data != null;
    
    this.form.valueChanges.subscribe(val => {
    this.esIgual = val.id !== this.data?.id || val.nombre !== this.data?.nombre;
    });
  }

  onNombreInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const uppercaseValue = input.value.toUpperCase();
    this.form?.get('nombre')?.setValue(uppercaseValue);
  }

  saveRegion(): void {
    const id = this.form?.get('id')?.value;
    const nombre = this.form?.get('nombre')?.value.toUpperCase();

    const region = new Region(nombre);
    region.id = id;

    if (this.esEdicion) {
      this.regionService.update(id, region).subscribe(data => {
        this.dialogRef.close(data);
      });
    } else {
      this.regionService.save(region).subscribe(data => {
        this.dialogRef.close(data);
      });
    }
  }

  cancelar(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.dialogRef.close();
  }

}