import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Region } from 'src/app/models/Region';
import { RegionService } from 'src/app/services/region.service';

@Component({
  selector: 'app-region-new',
  templateUrl: './region-new.component.html',
  styleUrls: ['./region-new.component.css']
})
export class RegionNewComponent implements OnInit {
  nombre: string = '';

  constructor(
    private RegionService: RegionService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<RegionNewComponent>,

    ) {}

  ngOnInit() {

  }

  onCreate(): void {
    const region = new Region(this.nombre);
    this.RegionService.save(region).subscribe(
      data=> {
        this.toastr.success('Region Agregada', 'OK', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
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
