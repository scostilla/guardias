import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Notificacion } from 'src/app/models/Notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { ProvinciaService } from 'src/app/services/provincia.service';

@Component({
  selector: 'app-notificacion-edit',
  templateUrl: './notificacion-edit.component.html',
  styleUrls: ['./notificacion-edit.component.css']
})
export class NotificacionEditComponent implements OnInit {

  form?: FormGroup;
  esEdicion?: boolean;
  esIgual: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private notificacionService: NotificacionService,
    private dialogRef: MatDialogRef<NotificacionEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Notificacion
  ) {

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data ? this.data.id : null],
      tipo: [this.data ? this.data.tipo : ''],
      categoria: [this.data ? this.data.categoria : ''],
      fechaNotificacion: [this.data ? this.data.fechaNotificacion : ''],
      detalle: [this.data ? this.data.detalle : ''],
      url: [this.data ? this.data.url : ''],
    });

    this.esEdicion = this.data != null;

    this.form.valueChanges.subscribe(val => {

      this.esIgual = val.id !== this.data?.id 
      || val.tipo !== this.data?.tipo 
      || val.categoria !== this.data?.categoria   
      || val.fechaNotificacion !== this.data?.fechaNotificacion 
      || val.detalle !== this.data?.detalle 
      || val.url !== this.data?.url;

    });
  }

  saveNotificacion(): void {
    const id = this.form?.get('id')?.value;
    const tipo = this.form?.get('tipo')?.value;
    const categoria = this.form?.get('categoria')?.value;
    const fechaNotificacion = this.form?.get('fechaNotificacion')?.value; 
    const detalle = this.form?.get('detalle')?.value;
    const url = this.form?.get('url')?.value;

    const notificacion = new Notificacion(tipo, categoria,fechaNotificacion,
       detalle, url, true);
    //notificacion.id = id;
    this.notificacionService.save(notificacion);
    if (this.esEdicion) {
      this.notificacionService.update(id, notificacion).subscribe(data => {
        this.dialogRef.close(data);
      });
    } else {
        this.notificacionService.save(notificacion).subscribe(data => {
        this.dialogRef.close(data);
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}
