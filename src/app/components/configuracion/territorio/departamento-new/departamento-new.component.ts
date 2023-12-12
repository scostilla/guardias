import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Departamento } from 'src/app/models/Departamento';
import { Provincia } from 'src/app/models/Provincia';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { ProvinciaService } from 'src/app/services/provincia.service';

@Component({
  selector: 'app-departamento-new',
  templateUrl: './departamento-new.component.html',
  styleUrls: ['./departamento-new.component.css']
})
export class DepartamentoNewComponent implements OnInit {
  codigoPostal: string = '';
  nombre: string = '';
  idProvincia: number = 0;
  provincia?: Provincia;
  departamento?: Departamento;

  constructor(
    private DepartamentoService: DepartamentoService,
    private provinciaService: ProvinciaService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<DepartamentoNewComponent>,

    ) {}

  ngOnInit() {

  }

  onCreate(): void {

    if(this.idProvincia){
      this. provinciaService.detail(this.idProvincia).subscribe(
        provincia => {
          this.departamento = new Departamento(this.codigoPostal, this.nombre, provincia);
          this.DepartamentoService.save(this.departamento).subscribe(
            data => {
              this.toastr.success('Departamento agendado','OK',{timeOut:6000,positionClass:'toast-top-center'});
              this.router.navigate(['/departamento']);
            },err => {
              this.toastr.error(err.error.message,'Error',{timeOut:7000,positionClass:'toast-top-center'});
              this.router.navigate(['/departamento']);
            }
          );
        },
        error =>{
          console.log('error al obtener el departamento', error);
        }
      );
    }
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

}
