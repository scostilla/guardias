import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Profesion } from 'src/app/models/Profesion';
import { ProfesionService } from 'src/app/services/profesion.service';


@Component({
  selector: 'app-profesion-detail',
  templateUrl: './profesion-detail.component.html',
  styleUrls: ['./profesion-detail.component.css']
})

export class ProfesionDetailComponent implements OnInit {

  profesion?: Profesion;

  constructor(
    private profesionService: ProfesionService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    public dialogo: MatDialogRef<ProfesionDetailComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { id: number }

  ) {}

  ngOnInit() {
    const id = this.data.id;
    this.profesionService.detalle(id).subscribe(
      data=> {
        this.profesion = data;
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
