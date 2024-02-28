import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ministerio } from 'src/app/models/Ministerio';
import { MinisterioService } from 'src/app/services/ministerio.service';


@Component({
  selector: 'app-ministerio-detail',
  templateUrl: './ministerio-detail.component.html',
  styleUrls: ['./ministerio-detail.component.css']
})

export class MinisterioDetailComponent implements OnInit {

  ministerio?: Ministerio;

  constructor(
    private ministerioService: MinisterioService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    public dialogo: MatDialogRef<MinisterioDetailComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { id: number }

  ) {}

  ngOnInit() {
    const id = this.data.id;
    this.ministerioService.detail(id).subscribe(
      data=> {
        this.ministerio = data;
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
