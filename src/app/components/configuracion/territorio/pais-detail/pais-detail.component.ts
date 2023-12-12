import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pais } from 'src/app/models/Pais';
import { PaisService } from 'src/app/services/pais.service';


@Component({
  selector: 'app-pais-detail',
  templateUrl: './pais-detail.component.html',
  styleUrls: ['./pais-detail.component.css']
})

export class PaisDetailComponent implements OnInit {

  pais?: Pais;

  constructor(
    private paisService: PaisService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    public dialogo: MatDialogRef<PaisDetailComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { id: number }

  ) {}

  ngOnInit() {
    const id = this.data.id;
    this.paisService.detail(id).subscribe(
      data=> {
        this.pais = data;
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
