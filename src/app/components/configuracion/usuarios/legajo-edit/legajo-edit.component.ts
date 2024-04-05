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
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { CargoService } from 'src/app/services/Configuracion/cargo.service';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';



@Component({
  selector: 'app-legajo-edit',
  templateUrl: './legajo-edit.component.html',
  styleUrls: ['./legajo-edit.component.css']
})

export class LegajoEditComponent implements OnInit {
  legajoForm!: FormGroup;
  initialData: any;
  profesiones: Profesion[] = [];
  efectores: Efector[] = [];
  cargos: Cargo[] = [];
  asistenciales: Asistencial[] = [];
  noAsistenciales: NoAsistencial[] = [];
  tipoSeleccionado?: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LegajoEditComponent>,
    private legajoService: LegajoService,
    private profesionService: ProfesionService,
    private personService: PersonService,
    private efectorService: EfectorService,
    private hospitalService: HospitalService,
    private cargoService: CargoService,
    private asistencialService: AsistencialService,
    private noAsistencialService: NoAsistencialService,
    @Inject(MAT_DIALOG_DATA) public data: Legajo
  ) {
    this.listProfesion();
    this.listUdo();
    this.listCargo();
  }

  ngOnInit(): void {

    this.legajoForm = this.fb.group({
      tipo: ['', Validators.required],
      persona: ['', Validators.required],
      actual: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      legal: ['', Validators.required],
      matriculaNacional: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9. ]{5,20}$')]],
      matriculaProvincial: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9. ]{5,20}$')]],
      profesion: ['', Validators.required],
      udo: ['', Validators.required],
      cargo: ['', Validators.required]
    });

       if (this.data) {
      this.legajoForm.patchValue(this.data);
    }



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
    this.hospitalService.listEfectores().subscribe(data => {
      console.log('Lista de Efectores:', data);
      this.efectores = data;
    }, error => {
      console.log(error);
    });
  }

  listCargo(): void {
    this.cargoService.list().subscribe(data => {
      this.cargos = data;
    }, error => {
      console.log(error);
    });
  }

  listAsistencial(): void {
    this.asistencialService.list().subscribe(data => {
      this.asistenciales = data;
    }, error => {
      console.log(error);
    });
  }

  listNoAsistencial(): void {
    this.noAsistencialService.list().subscribe(data => {
      this.noAsistenciales = data;
    }, error => {
      console.log(error);
    });
  }

  onTipoChange(tipo: string) {
    this.tipoSeleccionado = tipo;
    if (tipo === 'asistencial') {
      this.listAsistencial();
    } else if (tipo === 'noAsistencial') {
      this.listNoAsistencial();
    }
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

  compareCargo(p1: Cargo, p2: Cargo): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancel(): void {
    this.dialogRef.close({ type: 'cancel' });
  }
}