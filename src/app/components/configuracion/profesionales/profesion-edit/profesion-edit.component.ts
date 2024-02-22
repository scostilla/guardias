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

    this.formVal = this.fb.group({
      id: [this.data ? this.data.id : null],
      asistencial: [null, Validators.required],
      nombre: [null, [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,30}$')]],
    });

    this.esEdicion = this.data.id != -1;
   
    if (this.data.id != null) {
      this.profesionService.detalle(this.data.id).subscribe(
        data => {
          this.profesion = data;
          if (this.formVal){
            this.formVal.patchValue ({
             asistencial: this.profesion.asistencial,
              nombre: this.profesion.nombre,
            }); 
          }
        }
        )
      }
  }

  guardarProfesion(): void {
    
    const nombre = this.formVal?.get('nombre')?.value;
    const asistencial = this.formVal?.get('asistencial')?.value;
    const profesion = new Profesion(asistencial, nombre);
    
    if (this.esEdicion) {
      this.profesionService.update(this.data.id, profesion).subscribe(data => {
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
      this.profesionService.save(profesion).subscribe(data => {
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