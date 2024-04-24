import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Provincia } from 'src/app/models/Configuracion/Provincia';
import { ProvinciaDto } from 'src/app/dto/Configuracion/ProvinciaDto';
import { ProvinciaService } from 'src/app/services/Configuracion/provincia.service';
import { Pais } from 'src/app/models/Configuracion/Pais';
import { PaisService } from 'src/app/services/Configuracion/pais.service';

@Component({
  selector: 'app-provincia-edit',
  templateUrl: './provincia-edit.component.html',
  styleUrls: ['./provincia-edit.component.css']
})
export class ProvinciaEditComponent implements OnInit {
  provinciaForm: FormGroup;
  initialData: any;
  paises: Pais[] =[];

  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProvinciaEditComponent>,
    private provinciaService: ProvinciaService,
    private paisService: PaisService,
    @Inject(MAT_DIALOG_DATA) public data: Provincia
  ) {
    this.provinciaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,60}$')]],
      gentilicio: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,60}$')]],
      pais: ['', Validators.required]
    });

    this.listPais();
    
    if (data) {
      this.provinciaForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.initialData = this.provinciaForm.value;
    
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.provinciaForm.value);
  }

  listPais(): void {
    this.paisService.list().subscribe(data => {
      console.log('Lista de pais:', data);
      this.paises = data;
    }, error => {
      console.log(error);
    });
  }


  saveProvincia(): void {
    if (this.provinciaForm.valid) {
      const provinciaData = this.provinciaForm.value;

      const provinciaDto = new ProvinciaDto(
        provinciaData.nombre,
        provinciaData.gentilicio,
        provinciaData.idPais,
      );

      /* AYUDA: si this.data tiene un valor y un ID asociado */
      if (this.data && this.data.id) {
        this.provinciaService.update(this.data.id, provinciaDto).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        
        

        console.log("############ nombre provincia " + provinciaDto.nombre)
        console.log("############ id pais " + provinciaDto.idPais)
        this.provinciaService.save(provinciaDto).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      }
    }
  }

  comparePais(p1: Pais, p2: Pais): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancel(): void {
    this.dialogRef.close();
  }
}