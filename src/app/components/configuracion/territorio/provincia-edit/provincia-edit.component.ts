import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pais } from 'src/app/models/Pais';
import { Provincia } from 'src/app/models/Provincia';
import { PaisService } from 'src/app/services/pais.service';
import { ProvinciaService } from 'src/app/services/provincia.service';



@Component({
  selector: 'app-provincia-edit',
  templateUrl: './provincia-edit.component.html',
  styleUrls: ['./provincia-edit.component.css']
})
export class ProvinciaEditComponent implements OnInit {

  provincia?: Provincia;
  paises: Pais[] = [];
  selected = 9;


  constructor(
    private provinciaService: ProvinciaService,
    private paisService: PaisService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<ProvinciaEditComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit() {
    const id = this.data.id;
    this.provinciaService.detalle(id).subscribe(
      data=> {
        this.provincia = data;
        this.provincia.pais.id = data.pais.id;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
      }
    );
    this.paisService.lista().subscribe((data: Pais[]) => {
      this.paises = data;
      console.log(this.paises);
    });

  }

  onUpdate(): void {
    const id = this.data.id;
    console.log("onUpdate "+id);
    if(this.provincia) {
    this.provinciaService.update(id, this.provincia).subscribe(
      data=> {
        this.toastr.success('Provincia Modificado', 'OK', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/provincia'])
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/provincia'])
      }
    )
  }

  this.dialogRef.close();

  }

  cancel() {
    this.dialogRef.close();
  }

  }

