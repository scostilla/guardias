import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Region } from 'src/app/models/Region';
import { RegionService } from 'src/app/services/region.service';


@Component({
  selector: 'app-region-detail',
  templateUrl: './region-detail.component.html',
  styleUrls: ['./region-detail.component.css']
})

export class RegionDetailComponent implements OnInit {

  region?: Region;

  constructor(
    private regionService: RegionService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    public dialogo: MatDialogRef<RegionDetailComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { id: number }

  ) {}

  ngOnInit() {
    const id = this.data.id;
    this.regionService.detalle(id).subscribe(
      data=> {
        this.region = data;
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
