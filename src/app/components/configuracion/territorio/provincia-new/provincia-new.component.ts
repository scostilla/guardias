import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Provincia } from 'src/app/models/provincia';
import { ProvinciaService } from 'src/app/services/provincia.service';

@Component({
  selector: 'app-provincia-new',
  templateUrl: './provincia-new.component.html',
  styleUrls: ['./provincia-new.component.css']
})
export class ProvinciaNewComponent implements OnInit {
  gentilicio: string = '';
  nombre: string = '';
  id_pais?: number;

  constructor(
    private ProvinciaService: ProvinciaService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<ProvinciaNewComponent>,

    ) {}

  ngOnInit() {

  }

  onCreate(): void {
    if(this.id_pais)
    {
      const provincia = new Provincia(this.gentilicio, this.nombre, this.id_pais);
      this.ProvinciaService.save(provincia).subscribe(
        data=> {
          this.toastr.success('Provincia Agregada', 'OK', {
            timeOut: 6000, positionClass: 'toast-top-center'
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
