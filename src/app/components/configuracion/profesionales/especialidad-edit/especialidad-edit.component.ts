import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Especialidad } from 'src/app/models/Especialidad';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { Profesion } from 'src/app/models/Profesion';
import { ProfesionService } from 'src/app/services/profesion.service';



@Component({
  selector: 'app-especialidad-edit',
  templateUrl: './especialidad-edit.component.html',
  styleUrls: ['./especialidad-edit.component.css']
})
export class EspecialidadEditComponent implements OnInit {

  especialidad?: Especialidad;
  profesiones: Profesion[] = [];
  profesionesEncontrado?: Profesion;



  constructor(
    private especialidadService: EspecialidadService,
    private profesionService: ProfesionService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<EspecialidadEditComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit() {
    const id = this.data.id;
    this.especialidadService.detalle(id).subscribe(
      data=> {
        this.especialidad = data;
        this.especialidad.profesion.id = data.profesion.id;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
      }
    );
    this.profesionService.lista().subscribe((data: Profesion[]) => {
      this.profesiones = data;
      console.log(this.profesiones);
    });
  }

  profesionChange() {
    if (this.especialidad) {
      const nombre = this.especialidad.profesion.nombre;
      this.profesionesEncontrado = this.profesiones.find((profesion) => profesion.nombre === nombre);
    }
  }


  onUpdate(): void {
    const id = this.data.id;
    console.log("onUpdate "+id);
    if(this.especialidad) {
      this.especialidad.profesion = this.profesionesEncontrado ? this.profesionesEncontrado : this.especialidad.profesion;
    this.especialidadService.update(id, this.especialidad).subscribe(
      data=> {
        this.toastr.success('Especialidad Modificada', 'OK', {
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

  cancel() {
    this.dialogRef.close();
  }

  }

