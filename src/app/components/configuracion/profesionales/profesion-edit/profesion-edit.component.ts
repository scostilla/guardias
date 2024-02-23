import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Profesion } from 'src/app/models/Profesion';
import { ProfesionService } from 'src/app/services/profesion.service';

@Component({
  selector: 'app-profesion-edit',
  templateUrl: './profesion-edit.component.html',
  styleUrls: ['./profesion-edit.component.css']
})
export class ProfesionEditComponent implements OnInit {

  // Formulario para editar o crear una profesión
  form?: FormGroup;

  // Bandera para indicar si se trata de una edición o una creación
  esEdicion?: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private profesionService: ProfesionService,
    private dialogRef: MatDialogRef<ProfesionEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Profesion // Inyectar los datos de la profesión si es una edición
  ) { }

  ngOnInit(): void {
    // Inicializar el formulario con valores vacíos o con los datos de la profesión si es una edición
    this.form = this.formBuilder.group({
      id: [this.data ? this.data.id : null],
      nombre: [this.data ? this.data.nombre : '', [Validators.required, Validators.maxLength(50)]],
      asistencial: [this.data ? this.data.asistencial : '', Validators.required]
    });

    // Determinar si se trata de una edición o una creación según los datos recibidos
    this.esEdicion = this.data != null;
  }

  // Método para guardar o actualizar la profesión según el caso
  guardarProfesion(): void {
    // Obtener los valores del formulario
    const id = this.form?.get('id')?.value;
    const nombre = this.form?.get('nombre')?.value;
    const asistencial = this.form?.get('asistencial')?.value;

    // Crear un objeto de tipo Profesion
    const profesion = new Profesion(asistencial, nombre);
    profesion.id = id;

    // Enviar el objeto al servicio para guardarlo o actualizarlo en el backend según el caso
    if (this.esEdicion) {
      // Si es una edición, usar el método update del servicio
      this.profesionService.update(id, profesion).subscribe(data => {
        // Cerrar el diálogo y retornar el objeto actualizado
        this.dialogRef.close(data);
      });
    } else {
      // Si es una creación, usar el método save del servicio
      this.profesionService.save(profesion).subscribe(data => {
        // Cerrar el diálogo y retornar el objeto creado
        this.dialogRef.close(data);
      });
    }
  }

  // Método para cerrar el diálogo sin retornar ningún resultado
  cancelar(): void {
    this.dialogRef.close();
  }

}