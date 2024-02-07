import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Especialidad } from 'src/app/models/Especialidad';
import { EspecialidadService } from 'src/app/services/especialidad.service';


@Component({
  selector: 'app-especialidad-detail',
  templateUrl: './especialidad-detail.component.html',
  styleUrls: ['./especialidad-detail.component.css']
})

export class EspecialidadDetailComponent implements OnInit {

  especialidad?: Especialidad;

  constructor(
    private especialidadService: EspecialidadService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    public dialogo: MatDialogRef<EspecialidadDetailComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { id: number }

  ) {}

  ngOnInit() {
    const id = this.data.id;
    this.especialidadService.detalle(id).subscribe(
      data=> {
        this.especialidad = data;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
        this.dialogo.close();
      }
    );

  }

  cancel() {
    this.dialogo.close();
  }
}
