import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { ToastrService } from 'ngx-toastr';
import { Departamento } from 'src/app/models/departamento';

@Component({
  selector: 'app-departamento-new',
  templateUrl: './departamento-new.component.html',
  styleUrls: ['./departamento-new.component.css']
})
export class DepartamentoNewComponent implements OnInit {
  codigo_postal: number = 0;
  nombre: string = '';
  id_provincia: number = 0;

  constructor(
    private DepartamentoService: DepartamentoService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<DepartamentoNewComponent>,

    ) {}

  ngOnInit() {
    
  }

  onCreate(): void {
    const departamento = new Departamento(this.codigo_postal, this.nombre, this.id_provincia);
    this.DepartamentoService.save(departamento).subscribe(
      data=> {
        this.toastr.success('Departamento Agregado', 'OK', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/Departamento'])
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/Departamento'])
      }
    )

    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

}
