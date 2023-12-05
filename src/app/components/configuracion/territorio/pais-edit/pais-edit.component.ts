import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pais } from '../../../../models/pais';
import { PaisService } from '../../../../services/pais.service';


@Component({
  selector: 'app-pais-edit',
  templateUrl: './pais-edit.component.html',
  styleUrls: ['./pais-edit.component.css']
})
export class PaisEditComponent implements OnInit {

  pais?: Pais;

  constructor(
    private paisService: PaisService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<PaisEditComponent>,
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
        this.router.navigate(['/pais'])
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

