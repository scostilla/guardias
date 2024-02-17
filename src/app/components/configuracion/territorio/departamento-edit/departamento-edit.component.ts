import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Departamento } from 'src/app/models/Departamento';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { Provincia } from 'src/app/models/Provincia';
import { ProvinciaService } from 'src/app/services/provincia.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isEqual } from "lodash";


@Component({
  selector: 'app-departamento-edit',
  templateUrl: './departamento-edit.component.html',
  styleUrls: ['./departamento-edit.component.css']
})

export class DepartamentoEditComponent implements OnInit {

  departamento?: Departamento;
  provincias: Provincia[] = [];
  provinciasEncontrado?: Provincia;
  formVal!: FormGroup;  
  formInicial: any;
  

  constructor(
    private departamentoService: DepartamentoService,
    private provinciaService: ProvinciaService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DepartamentoEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
  ) {}

  ngOnInit() {
    const id = this.data.id;
    this.departamentoService.detalle(id).subscribe(
      data=> {
        this.departamento = data;
        this.departamento.provincia.id = data.provincia.id;
        this.formInicial = {
          codigoPostal: this.departamento?.codigoPostal,
          nombre: this.departamento?.nombre,
          idProvincia: this.departamento?.provincia.id
        };    
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
      }
    );
    this.provinciaService.lista().subscribe((data: Provincia[]) => {
      this.provincias = data;
      console.log(this.provincias);
    });

    this.formVal = this.fb.group ({
      codigoPostal: ['', [Validators.required, Validators.pattern('^[0-9]{2,8}$')]],
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      idProvincia: ['', [Validators.required]]
    });

  }

  compararValores(): boolean {
    const valoresActuales = this.formVal.value;
    return isEqual(valoresActuales, this.formInicial);
  }

  provinciaChange() {
    if (this.departamento) {
      const nombre = this.departamento.provincia.nombre;
      this.provinciasEncontrado = this.provincias.find((provincia) => provincia.nombre === nombre);
    }
  }


  onUpdate(): void {
    const id = this.data.id;
    console.log("onUpdate "+id);
    if(this.departamento) {
      this.departamento.provincia = this.provinciasEncontrado ? this.provinciasEncontrado : this.departamento.provincia;
    this.departamentoService.update(id, this.departamento).subscribe(
      data=> {
        this.toastr.success('Departamento Modificado', 'OK', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
      }
    )
  }
  this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }
  }