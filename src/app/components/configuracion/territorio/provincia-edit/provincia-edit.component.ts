import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pais } from 'src/app/models/Pais';
import { Provincia } from 'src/app/models/Provincia';
import { PaisService } from 'src/app/services/pais.service';
import { ProvinciaService } from 'src/app/services/provincia.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isEqual } from 'lodash';


@Component({
  selector: 'app-provincia-edit',
  templateUrl: './provincia-edit.component.html',
  styleUrls: ['./provincia-edit.component.css'],
})

export class ProvinciaEditComponent implements OnInit {
  provincia?: Provincia;
  paises: Pais[] = [];
  paisEncontrado?: Pais;
  gentilicio: string = '';
  nombre: string = '';
  idPais?: number;
  pais?: Pais;
  id?: number;
  MyForm: FormGroup;
  initialForm: any;
  formChanged?: boolean;



  constructor(
    private provinciaService: ProvinciaService,
    private paisService: PaisService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProvinciaEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.MyForm = this.fb.group({
      nombre: [
        '',
        [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')],
      ],
      gentilicio: [
        '',
        [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')],
      ],
      idPais: ['', Validators.required],
    });

  }

  ngOnInit() {
    this.id = this.data.id; 
  if (this.id == -1){
    this.onCreate();
  }else{
    this.provinciaService.detalle(this.id).subscribe(
      (data) => {
        this.provincia = data;
        this.provincia.pais.id = data.pais.id;
       this.MyForm.patchValue({
        nombre: this.provincia.nombre,
        gentilicio: this.provincia.gentilicio,
        idPais: this.provincia.pais.id
      });
      this.initialForm = this.MyForm.value;
        },
      (err) => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
        });
      }
    );
    this.paisService.lista().subscribe((data: Pais[]) => {
      this.paises = data;
      console.log(this.paises);
    });
  }
  this.MyForm.valueChanges.subscribe(values => {
    this.formChanged = this.MyForm.valid && !isEqual(this.MyForm.value, this.initialForm);
  });
 }

  paisChange() {
    if (this.provincia) {
      const nombre = this.provincia.pais.nombre;
      this.paisEncontrado = this.paises.find((pais) => pais.nombre === nombre);
    }
  }

  onUpdate(): void {
    const id = this.data.id;

    console.log('onUpdate ' + id);
    if (this.provincia) {
      this.provincia.pais = this.paisEncontrado ? this.paisEncontrado : this.provincia.pais;
      this.provinciaService.update(id, this.provincia).subscribe(
        (data) => {
          this.toastr.success('Provincia Modificada', 'OK', {
            timeOut: 7000,
            positionClass: 'toast-top-center',
          });
        },
        (err) => {
          this.toastr.error(err.error.mensaje, 'Error', {
            timeOut: 7000,
            positionClass: 'toast-top-center',
          });
        }
      );
    }

    this.dialogRef.close();
  }

  onCreate(): void {
    this.paisService.lista().subscribe((data: Pais[]) => {
      this.paises = data;
    });
    if (this.idPais) {
      this.paisService.detalle(this.idPais).subscribe(
        pais => {
          this.provincia = new Provincia(this.gentilicio, this.nombre, pais);
          this.provinciaService.save(this.provincia).subscribe(
            data => {
              this.toastr.success('Provincia Agregada', 'OK', {
                timeOut: 6000, positionClass: 'toast-top-center'
              });
            },
            err => {
              this.toastr.error(err.error.mensaje, 'Error', {
                timeOut: 7000, positionClass: 'toast-top-center'
              });
            }
          );
        },
        error => {
          console.error('Error al obtener el detalle del país:', error);
        }
      );
    }
  }

  onSubmit (form: any): void {
    this.MyForm.markAllAsTouched (); 
    this.onValueChanged (); 
    if (this.MyForm.valid) { 
      console.log (form); 
    }
  }
  
  onValueChanged() {
    throw new Error('Method not implemented.');
  }

  cancel() {
    this.dialogRef.close();
  }
}
