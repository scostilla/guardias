import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EfectorSummaryDto } from 'src/app/dto/Configuracion/efector/EfectorSummaryDto';
import { NotificacionDto } from 'src/app/dto/NotificacionDto';
import { Notificacion } from 'src/app/models/Notificacion';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { NotificacionService } from 'src/app/services/notificacion.service';

@Component({
  selector: 'app-notificacion-edit',
  templateUrl: './notificacion-edit.component.html',
  styleUrls: ['./notificacion-edit.component.css']
})
export class NotificacionEditComponent implements OnInit {

  form?: FormGroup;
  esEdicion?: boolean;
  esIgual: boolean = false;
  selectedFile: File | null = null;
  fileUrl: string | null = null;
  ministerios: EfectorSummaryDto[] = [];
  hospitales: EfectorSummaryDto[] = [];
  notificacionDto: NotificacionDto | undefined;

  constructor(
    private fb: FormBuilder,
    private notificacionService: NotificacionService,
    private dialogRef: MatDialogRef<NotificacionEditComponent>,
    private ministerioService: MinisterioService,
    private hospitalService: HospitalService,
    @Inject(MAT_DIALOG_DATA) private data: Notificacion
  ) { }

    ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data ? this.data.id : null],
      tipo: [this.data ? this.data.tipo : '', Validators.required], // Añade Validators.required a los campos obligatorios
      categoria: [this.data ? this.data.categoria : '', Validators.required],
      fechaNotificacion: [this.data ? this.data.fechaNotificacion : '', Validators.required],
      detalle: [this.data ? this.data.detalle : '', Validators.required],
      url: [this.data ? this.data.url : ''],
      ministerioId: [this.data?.idEfectores[0] || null],
      hospitalId: [this.data?.idEfectores[0] || null]
    }, { validator: this.requireEfector });

    this.esEdicion = this.data != null;
    if (this.esEdicion && this.data?.url && this.data.url.startsWith('assets/')) {
      this.fileUrl = this.data.url;
    }

    this.form.valueChanges.subscribe(val => {
      this.esIgual = val.id !== this.data?.id
        || val.tipo !== this.data?.tipo
        || val.categoria !== this.data?.categoria
        || val.fechaNotificacion !== this.data?.fechaNotificacion
        || val.detalle !== this.data?.detalle
        || val.url !== this.data?.url
        || val.ministerioId !== (this.data?.idEfectores[0])
        || val.hospitalId !== (this.data?.idEfectores[0]);
    });

    this.loadEfectores();
  }

requireEfector(group: FormGroup) {
    const ministerioId = group.controls['ministerioId'].value;
    const hospitalId = group.controls['hospitalId'].value;

    if (!ministerioId && !hospitalId) {
      return { requireEfector: true }; // Retorna un error si ambos son nulos/undefined
    }
    return null; // Retorna null si al menos uno tiene valor
  }

  loadEfectores(): void {
    this.ministerioService.listSelection().subscribe(
      (data) => {
        this.ministerios = data;
      },
      (error) => {
        console.error('Error al cargar ministerios', error);
      }
    );
    this.hospitalService.listSelection().subscribe(
      (data) => {
        this.hospitales = data;
      },
      (error) => {
        console.error('Error al cargar hospitales', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.fileUrl = null;
  }

  uploadFile(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const timestamp = Date.now();
        const filename = `${timestamp}_${this.selectedFile?.name}`;
        this.fileUrl = `assets/uploads/${filename}`;
        this.form?.patchValue({ url: this.fileUrl });
        console.log('Archivo simulado guardado en:', this.fileUrl);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveNotificacion(): void {
    if (this.form?.valid) {
      const id = this.form?.get('id')?.value;
      const tipo = this.form?.get('tipo')?.value;
      const categoria = this.form?.get('categoria')?.value;
      const fechaNotificacion = this.form?.get('fechaNotificacion')?.value;
      const fechaBaja = new Date(); // Asignar la fecha actual como fecha de baja
      const detalle = this.form?.get('detalle')?.value;
      const url = this.form?.get('url')?.value;
      const ministerioId = this.form?.get('ministerioId')?.value;
      const hospitalId = this.form?.get('hospitalId')?.value;

      const idEfectores: number[] = [];
      if (ministerioId !== null && ministerioId !== undefined) {
        idEfectores.push(ministerioId);
      }
      if (hospitalId !== null && hospitalId !== undefined) {
        idEfectores.push(hospitalId);
      }

      console.log('ID del Ministerio seleccionado:', ministerioId);
      console.log('ID del Hospital seleccionado:', hospitalId);
      console.log('Array de efectores que se enviará:', idEfectores);

      // Crear un objeto que coincida con NotificacionDto del backend
      const notificacionDto: NotificacionDto = {
        tipo,
        categoria,
        detalle,
        url,
        fechaNotificacion,
        fechaBaja, // Puedes ajustar esto según tu lógica
        activo: true, // Asignar un valor por defecto o según tu lógica
        idEfectores // ¡OJO! Aquí debería ser 'idEfectores' para coincidir con el DTO del backend
      } as NotificacionDto; // Añadimos un type assertion

      console.log('Datos del DTO que se enviarán:', notificacionDto); 

      if (this.esEdicion) {
        this.notificacionService.update(id, notificacionDto).subscribe(data => {
          this.dialogRef.close(data);
        });
      } else {
        this.notificacionService.save(notificacionDto).subscribe(data => {
          this.dialogRef.close(data);
        });
      }
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}