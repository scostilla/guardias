import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Profesion } from 'src/app/models/Profesion';
import { ProfesionService } from 'src/app/services/profesion.service';


@Component({
  selector: 'app-profesion-edit',
  templateUrl: './profesion-edit.component.html',
  styleUrls: ['./profesion-edit.component.css']
})
export class ProfesionEditComponent implements OnInit {

  profesion?: Profesion;
  asistencial?: boolean;
  nombre: string = '';
  id: any;

  constructor(
    private profesionService: ProfesionService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<ProfesionEditComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}


  ngOnInit() {
    const id = this.data.id;
    if (id === -1) {
      this.onCreate();
    } else {
    this.profesionService.detalle(id).subscribe(
      data=> {
        this.profesion = data;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
      }
    );
    }
  }

  onUpdate(): void {
    const id = this.data.id;
    console.log("onUpdate "+id);
    if(this.profesion) {
    this.profesionService.update(id, this.profesion).subscribe(
      data=> {
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
    const profesion = new Profesion(this.asistencial!, this.nombre);
    this.profesionService.save(profesion).subscribe(
      data=> {
        this.toastr.success('Profesion Agregada', 'OK', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
      }
    )

    this.dialogRef.close();
  }



  cancel() {
    this.dialogRef.close();
  }

  }