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
  asistencial?: boolean;
  nombre?: string;
  id?: number;
  formVal!: FormGroup;  
  formInicial: any;


  constructor(
    private profesionService: ProfesionService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProfesionEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, isAdding: boolean }
  ) {
    
  }


  ngOnInit() {
    this.formVal = this.fb.group ({
      asistencial: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,30}$')]],
    });

    this.id = this.data.id;
    if (this.data.isAdding) {
      this.onCreate();
    } else {
      this.profesionService.detalle(this.id).subscribe(
        data => {
          this.profesion = data;
          this.formInicial = {
            asistencial: this.profesion.asistencial,
            nombre: this.profesion.nombre,
          };    
  
        },
        err => {
          this.toastr.error(err.error.mensaje, 'Error al cargar la profesion', {
            timeOut: 6000, positionClass: 'toast-top-center'
          });
        }
      );
    }
  }

  onUpdate(): void {
    const id = this.data.id;
    console.log("onUpdate " + id);
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
    let profesion = new Profesion(this.asistencial!, this.nombre);
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
  }

  compararValores(): boolean {
    const valoresActuales = this.formVal.value;
    return isEqual(valoresActuales, this.formInicial);
  }
  get getAsistencial(){
    return this.formVal.get('asistencial') as FormControl;
  }
  get getNombre(){
    return this.formVal.get('nombre') as FormControl;
  }

  cancel() {
    this.dialogRef.close();
  }

}