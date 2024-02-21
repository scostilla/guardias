import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Profesion } from 'src/app/models/Profesion';
import { ProfesionService } from 'src/app/services/profesion.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { isEqual } from 'lodash';


@Component({
  selector: 'app-profesion-edit',
  templateUrl: './profesion-edit.component.html',
  styleUrls: ['./profesion-edit.component.css']
})
export class ProfesionEditComponent implements OnInit {

  profesion: Profesion = new Profesion();
  //asistencial?: boolean;
 // nombre?: string;
 // id?: number;
  formVal?: FormGroup;  
  formInicial: any;

  esEdicion?: boolean;

  constructor(
    private profesionService: ProfesionService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProfesionEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    
  }


  ngOnInit() {

    if (this.data.id != -1) {
      console.log(this.data.id + "entraaaa id");
      this.profesionService.detalle(this.data.id).subscribe(
        data => {
          this.profesion = data;
          this.formInicial = {
            asistencial: this.profesion.asistencial,
            nombre: this.profesion.nombre,
          }; 
          console.log("valor de nombre cargado "+ this.profesion.nombre); 
          console.log("valor de asistencial  "+ this.profesion.asistencial); 
          }
        )
      }
      console.log("$$$$$$$ "+ this.profesion.nombre); 
      console.log("%%%%%%"+ this.profesion.asistencial); 
    this.formVal = this.fb.group ({
      id: [this.data ? this.data.id : null],
      asistencial: [this.data ? this.profesion.asistencial : '', Validators.required],
      nombre: [this.data ? this.profesion.nombre: '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,30}$')]],
      
    });
    this.esEdicion = this.data.id != -1;

    console.log("id###########" );
    console.log("nombre###########" + this.profesion.nombre);
      console.log("asis#######" + this.profesion.asistencial);
  }

  guardarProfesion(): void {
    console.log("ENTROO");
    
    // Obtener los valores del formulario
    const nombre = this.formVal?.get('nombre')?.value;
    
    const asistencial = this.formVal?.get('asistencial')?.value;
    
    // Crear un objeto de tipo Profesion
    const profesion = new Profesion(asistencial, nombre);
    //profesion.id = this.data.id;

    // Enviar el objeto al servicio para guardarlo o actualizarlo en el backend según el caso
    console.log("es edicion " + this.esEdicion);
    if (this.esEdicion) {
      // Si es una edición, usar el método update del servicio
      console.log("nombre" + profesion.nombre);
      console.log("asis" + profesion.asistencial);
      console.log("id" + this.data.id);
      this.profesionService.update(this.data.id, profesion).subscribe(data => {
        // Cerrar el diálogo y retornar el objeto actualizado
        this.toastr.success('Profesion Modificada', 'OK', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
        this.dialogRef.close(data);
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
      }
      );
    } else {
      // Si es una creación, usar el método save del servicio
      this.profesionService.save(profesion).subscribe(data => {
        // Cerrar el diálogo y retornar el objeto creado
        this.toastr.success('Profesion Agregada', 'OK', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
        this.dialogRef.close(data);
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error al guardar la profesion', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
      }
      );
    }
  }

  // Método para cerrar el diálogo sin retornar ningún resultado
  cancelar(): void {
    this.dialogRef.close();
  }

  /* onUpdate(): void {
    const id = this.data.id;
    //console.log("onUpdate " + id);
    if (this.profesion) {
      this.profesionService.update(id, this.profesion).subscribe(
        data => {
          this.toastr.success('Profesion Modificada', 'OK', {
            timeOut: 7000, positionClass: 'toast-top-center'
          });
        },
        err => {
          this.toastr.error(err.error.mensaje, 'Error', {
            timeOut: 7000, positionClass: 'toast-top-center'
          });
        }
      )
    }
    this.dialogRef.close();

  }

  onCreate(): void {
    this.profesion.asistencial= this.asistencial;
    this.profesion.nombre=this.nombre;
    let profesion = new Profesion(this.asistencial!, this.nombre);
    console.log("asisnteicial "+ profesion.nombre);
    if (profesion.nombre != null) {
      this.profesionService.save(profesion).subscribe(
        data => {
          this.toastr.success('Profesion Agregada', 'OK', {
            timeOut: 7000, positionClass: 'toast-top-center'
          });
          this.dialogRef.close();
        },
        err => {
          this.toastr.error(err.error.mensaje, 'Error al guardar la profesion', {
            timeOut: 7000, positionClass: 'toast-top-center'
          });
        }

      )
    }
  } */

  /* compararValores(): boolean {
    const valoresActuales = this.formVal.value;
    return isEqual(valoresActuales, this.formInicial);
  }
  get getAsistencial(){
    return this.formVal.get('asistencial') as FormControl;
  }
  get getNombre(){
    return this.formVal.get('nombre') as FormControl;
  } */

  cancel() {
    this.dialogRef.close();
  }

}