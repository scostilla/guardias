import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Departamento } from 'src/app/models/Departamento';
import { Localidad } from 'src/app/models/Localidad';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { LocalidadService } from 'src/app/services/localidad.service';

@Component({
  selector: 'app-localidad-new',
  templateUrl: './localidad-new.component.html',
  styleUrls: ['./localidad-new.component.css']
})

export class LocalidadNewComponent implements OnInit {
  nombre: string = '';
  idDepartamento?: number;
  localidad?: Localidad;
  departamento?: Departamento;
  Departamentos: Departamento[] = [];


  constructor(
    private LocalidadService: LocalidadService,
    private DepartamentoService: DepartamentoService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<LocalidadNewComponent>,

    ) {}

  ngOnInit() {
    this.DepartamentoService.list().subscribe((data: Departamento[]) => {
      this.Departamentos = data;
    });
  }

  onCreate(): void {

    if(this.idDepartamento){
      this. DepartamentoService.detail(this.idDepartamento).subscribe(
        departamento => {
          this.localidad = new Localidad(this.nombre, departamento);
          this.LocalidadService.save(this.localidad).subscribe(
            data => {
              this.toastr.success('Localidad agendada','OK',{timeOut:6000,positionClass:'toast-top-center'});
            },err => {
              this.toastr.error(err.error.message,'Error',{timeOut:7000,positionClass:'toast-top-center'});
            }
          );
        },
        error =>{
          console.log('error al obtener la localidad', error);
        }
      );
    }
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

}
