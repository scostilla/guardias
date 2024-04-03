import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { Person } from 'src/app/models/Configuracion/Person';
import { PersonService } from 'src/app/services/Configuracion/person.service';
import { Profesion } from 'src/app/models/Configuracion/Profesion';
import { ProfesionService } from 'src/app/services/Configuracion/profesion.service';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';



@Component({
  selector: 'app-legajo-edit',
  templateUrl: './legajo-edit.component.html',
  styleUrls: ['./legajo-edit.component.css']
})
export class LegajoEditComponent implements OnInit {
  legajoForm: FormGroup;
  initialData: any;
  profesiones: Profesion[] = [];
  efectores: Efector[] = [];


  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LegajoEditComponent>,
    private legajoService: LegajoService,
    private profesionService: ProfesionService,
    private efectorService: EfectorService,
    @Inject(MAT_DIALOG_DATA) public data: Legajo
  ) {
    this.legajoForm = this.fb.group({
      actual: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      legal: ['', Validators.required],
      matriculaNacional: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9. ]{5,20}$')]],
      matriculaProvincial: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9. ]{5,20}$')]],
      persona: ['', Validators.required],
      profesion: ['', Validators.required],
      udo: ['', Validators.required],
      cargo: ['', Validators.required]
    });

    if (data) {
      this.legajoForm.patchValue(data);
    }

  }

  ngOnInit(): void {
    this.listProfesion();
    this.listUdo();

    this.initialData = this.legajoForm.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.legajoForm.value);
  }

  listProfesion(): void {
    this.profesionService.list().subscribe(data => {
      console.log('Lista de Profesiones:', data);
      this.profesiones = data;
    }, error => {
      console.log(error);
    });
  }

  listUdo(): void {
    this.efectorService.list().subscribe(data => {
      console.log('Lista de Efectores:', data);
      this.efectores = data;
    }, error => {
      console.log(error);
    });
  }

  saveLegajo(): void {
    if (this.legajoForm.valid) {
      const legajoData = this.legajoForm.value;
      if (this.data && this.data.id) {
        this.legajoService.update(this.data.id, legajoData).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        this.legajoService.save(legajoData).subscribe(
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

  comparePersona(p1: Person, p2: Person): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareProfesion(p1: Profesion, p2: Profesion): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareEfector(p1: Efector, p2: Efector): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }


  cancel(): void {
    this.dialogRef.close({ type: 'cancel' });
  }
}
