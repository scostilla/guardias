import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Departamento } from 'src/app/models/Departamento';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { Localidad } from 'src/app/models/Localidad';
import { LocalidadService } from 'src/app/services/localidad.service';



@Component({
  selector: 'app-localidad-edit',
  templateUrl: './localidad-edit.component.html',
  styleUrls: ['./localidad-edit.component.css']
})
export class LocalidadEditComponent implements OnInit {

  localidad?: Localidad;
  departamentos: Departamento[] = [];


  constructor(
    private LocalidadService: LocalidadService,
    private departamentoService: DepartamentoService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<LocalidadEditComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit() {
    const id = this.data.id;
    this.LocalidadService.detalle(id).subscribe(
      data=> {
        this.localidad = data;
        this.localidad.departamento.id = data.departamento.id;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
      }
    );
    this.departamentoService.lista().subscribe((data: Departamento[]) => {
      this.departamentos = data;
      console.log(this.departamentos);
    });
  }

  onUpdate(): void {
    const id = this.data.id;
    console.log("onUpdate "+id);
    if(this.localidad) {
    this.LocalidadService.update(id, this.localidad).subscribe(
      data=> {
        this.toastr.success('Localidad Modificada', 'OK', {
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

