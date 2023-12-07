import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Localidad } from 'src/app/models/localidad';
import { LocalidadService } from 'src/app/services/localidad.service';


@Component({
  selector: 'app-localidad-detail',
  templateUrl: './localidad-detail.component.html',
  styleUrls: ['./localidad-detail.component.css']
})

export class LocalidadDetailComponent implements OnInit {

  localidad?: Localidad;

  constructor(
    private localidadService: LocalidadService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    public dialogo: MatDialogRef<LocalidadDetailComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { id: number }

  ) {}

  ngOnInit() {
    const id = this.data.id;
    this.localidadService.detail(id).subscribe(
      data=> {
        this.localidad = data;
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
