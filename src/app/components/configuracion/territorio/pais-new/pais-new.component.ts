import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pais } from 'src/app/models/Pais';
import { PaisService } from 'src/app/services/pais.service';

@Component({
  selector: 'app-pais-new',
  templateUrl: './pais-new.component.html',
  styleUrls: ['./pais-new.component.css']
})
export class PaisNewComponent implements OnInit {
  codigo: string = '';
  nacionalidad: string = '';
  nombre: string = '';

  constructor(
    private PaisService: PaisService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<PaisNewComponent>,

    ) {}

  ngOnInit() {

  }

  onCreate(): void {
    const pais = new Pais(this.codigo, this.nacionalidad, this.nombre);
    this.PaisService.save(pais).subscribe(
      data=> {
        this.toastr.success('Pais Agregado', 'OK', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/pais'])
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
