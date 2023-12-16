import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Departamento } from 'src/app/models/Departamento';
import { DepartamentoService } from 'src/app/services/departamento.service';


@Component({
  selector: 'app-departamento-edit',
  templateUrl: './departamento-edit.component.html',
  styleUrls: ['./departamento-edit.component.css']
})
export class DepartamentoEditComponent implements OnInit {

  departamento?: Departamento;

  constructor(
    private departamentoService: DepartamentoService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<DepartamentoEditComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit() {
    const id = this.data.id;
    this.departamentoService.detalle(id).subscribe(
      data=> {
        this.departamento = data;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
      }
    );
  }

  onUpdate(): void {
    const id = this.data.id;
    console.log("onUpdate "+id);
    if(this.departamento) {
    this.departamentoService.update(id, this.departamento).subscribe(
      data=> {
        this.toastr.success('Departamento Modificado', 'OK', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/departamento'])
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/departamento'])
      }
    )
  }

  this.dialogRef.close();

  }

  cancel() {
    this.dialogRef.close();
  }

  }

