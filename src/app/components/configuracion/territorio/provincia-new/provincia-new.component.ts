import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { ProvinciaService } from 'src/app/services/provincia.service';
import { ToastrService } from 'ngx-toastr';
import { Provincia } from 'src/app/models/provincia';

@Component({
  selector: 'app-provincia-new',
  templateUrl: './provincia-new.component.html',
  styleUrls: ['./provincia-new.component.css']
})
export class ProvinciaNewComponent implements OnInit {
  gentilicio: string = '';
  nombre: string = '';
  id_pais: number = null;

  constructor(
    private ProvinciaService: ProvinciaService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<ProvinciaNewComponent>,

    ) {}

  ngOnInit() {
    
  }

  onCreate(): void {
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

    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

}
