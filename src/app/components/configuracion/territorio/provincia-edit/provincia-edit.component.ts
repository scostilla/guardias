import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pais } from '../../../../models/pais';
import { PaisService } from '../../../../services/pais.service';

@Component({
  selector: 'app-provincia-edit',
  templateUrl: './provincia-edit.component.html',
  styleUrls: ['./provincia-edit.component.css']
})
export class ProvinciaEditComponent implements OnInit {

  pais?: Pais;

  constructor(
    private paisService: PaisService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<ProvinciaEditComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit() {
    const id = this.data.id;
    console.log("ngOnInit "+id);
    this.paisService.detail(id).subscribe(
      data=> {
        this.toastr.success('Pais Modificado', 'OK', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/pais']);
        console.log(this.paisService);
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/pais'])
      }
    );
  }

  onUpdate(): void {
    const id = this.data.id;
    console.log("onUpdate "+id);
    if(this.pais) {
    this.paisService.update(id, this.pais).subscribe(
      data=> {
        this.toastr.success('Pais Modificado', 'OK', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/pais'])
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/pais'])
      }
    )
  }

  this.dialogRef.close();

  }

  cancel() {
    this.dialogRef.close();
  }

  }

