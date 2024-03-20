import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-asistencial-edit',
  templateUrl: './asistencial-edit.component.html',
  styleUrls: ['./asistencial-edit.component.css']
})
export class AsistencialEditComponent implements OnInit {

  form?: FormGroup;
  esEdicion?: boolean;
  esIgual: boolean = false;

  constructor(
    private fb: FormBuilder,
    private asistencialService: AsistencialService,
    private dialogRef: MatDialogRef<AsistencialEditComponent>,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: Asistencial 
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data ? this.data.id : null],
      nombre: [this.data ? this.data.nombre : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,50}$')]],
      apellido: [this.data ? this.data.apellido : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,50}$')]],
      cuil: [this.data ? this.data.cuil : '', [Validators.pattern('^[0-9]{11}$')]],
      dni: [this.data ? this.data.dni : '', [Validators.pattern('^[0-9]{8,20}$')]],
      domicilio: [this.data ? this.data.domicilio : '', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9°. ]{1,255}$')]],
      telefono: [this.data ? this.data.telefono : '', [Validators.pattern('^[0-9]{9,30}$')]],
      email: [this.data ? this.data.email : '', [Validators.required, Validators.email]],
      estado: [this.data ? this.data.estado : '', Validators.required],
      fechaNacimiento: [this.data ? this.transformDate(this.data.fechaNacimiento) : '', [Validators.required]],
      sexo: [this.data ? this.data.sexo : '', Validators.required],
      idTipoGuardia: [this.data ? this.data.idTipoGuardia : '', [Validators.pattern('^[0-9]{1,11}$')]],
      tipoGuardia: [this.data ? this.data.tipoGuardia : '', Validators.required]
    });

    this.esEdicion = this.data != null;
    
    this.form.valueChanges.subscribe(val => {
    this.esIgual = val.id !== this.data?.id || val.nombre !== this.data?.nombre || val.apellido !== this.data?.apellido || val.cuil !== this.data?.cuil ||
    val.dni !== this.data?.dni || val.domicilio !== this.data?.domicilio || val.telefono !== this.data?.telefono || val.email !== this.data?.email ||
    val.estado !== this.data?.estado  || val.fechaNacimiento !== this.data?.fechaNacimiento || val.sexo !== this.data?.sexo || val.idTipoGuardia !== this.data?.idTipoGuardia || val.tipoGuardia !== this.data?.tipoGuardia;
    });
  }

  transformDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }

  saveAsistencial(): void {
    const id = this.form?.get('id')?.value;
    const nombre = this.form?.get('nombre')?.value;
    const apellido = this.form?.get('apellido')?.value;
    const cuil = this.form?.get('cuil')?.value;
    const dni = this.form?.get('dni')?.value;
    const domicilio = this.form?.get('domicilio')?.value;
    const telefono = this.form?.get('telefono')?.value;
    const email = this.form?.get('email')?.value;
    const estado = this.form?.get('estado')?.value;
    const fechaNacimiento = this.form?.get('fechaNacimiento')?.value;
    const sexo = this.form?.get('sexo')?.value;
    const idTipoGuardia = this.form?.get('idTipoGuardia')?.value;
    const tipoGuardia = this.form?.get('tipoGuardia')?.value;



    const asistencial = new Asistencial(nombre, apellido, cuil, dni, domicilio, telefono, email, estado, fechaNacimiento, sexo, idTipoGuardia, tipoGuardia);
    asistencial.id = id;

    if (this.esEdicion) {
      this.asistencialService.update(id, asistencial).subscribe(data => {
        this.dialogRef.close(data);
      });
    } else {
      this.asistencialService.save(asistencial).subscribe(data => {
        this.dialogRef.close(data);
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}