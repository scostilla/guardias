import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { Profesion } from 'src/app/models/Configuracion/Profesion';
import { ProfesionService } from 'src/app/services/Configuracion/profesion.service';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Revista } from 'src/app/models/Configuracion/Revista';
import { RevistaService } from 'src/app/services/Configuracion/revista.service';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { LegajoDto } from 'src/app/dto/Configuracion/LegajoDto';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { CargoService } from 'src/app/services/Configuracion/cargo.service';
import { EspecialidadService } from 'src/app/services/Configuracion/especialidad.service';
import { Especialidad } from 'src/app/models/Configuracion/Especialidad';

@Component({
  selector: 'app-legajo-edit',
  templateUrl: './legajo-edit.component.html',
  styleUrls: ['./legajo-edit.component.css']
})
export class LegajoEditComponent implements OnInit {
  legajoForm: FormGroup;
  initialData: any;
  personas: Asistencial[] = [];
  profesiones: Profesion[] = [];
  efectores: Efector[] = [];
  revistas: Revista[] = [];
  cargos: Cargo[] = [];
  especialidades: Especialidad[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LegajoEditComponent>,
    private legajoService: LegajoService,
    private profesionService: ProfesionService,
    private revistaService: RevistaService,
    private asistencialService: AsistencialService,
    private hospitalService: HospitalService,
    private cargoService: CargoService,
    private especialidadService: EspecialidadService,

    @Inject(MAT_DIALOG_DATA) public data: Legajo
  ) {
    this.legajoForm = this.fb.group({
      persona: ['', Validators.required],
      profesion: ['', Validators.required],
      revista: ['', Validators.required],
      udo: ['', Validators.required],
      efectores: [[]],
      especialidades: [[]],
      matriculaNacional: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9. ]{5,20}$')]],
      matriculaProvincial: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9. ]{5,20}$')]],
      actual: ['', Validators.required],
      legal: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinal: [''],
      cargo: ['', Validators.required],
    });

    this.listAsistenciales();
    this.listProfesiones();
    this.listRevistas();
    this.listUdos();
    this.listCargos();
    this.listEspecialidades();

    if (data) {
      this.legajoForm.patchValue({
        ...data,
        efectores: data.efectores ? data.efectores.map((efector: any) => efector.id) : [],
        especialidades: data.especialidades ? data.especialidades.map((especialidad: any) => especialidad.id) : []
      });
    }
  }

  ngOnInit(): void {
    this.initialData = this.legajoForm.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.legajoForm.value);
  }

  listAsistenciales(): void {
    this.asistencialService.list().subscribe(data => {
      this.personas = data;
    }, error => {
      console.log(error);
    });
  }

  listProfesiones(): void {
    this.profesionService.list().subscribe(data => {
      this.profesiones = data;
    }, error => {
      console.log(error);
    });
  }

  listRevistas(): void {
    this.revistaService.list().subscribe(data => {
      this.revistas = data;
    }, error => {
      console.log(error);
    });
  }

  listUdos(): void {
    /* aqui falta agregar metodo en back para que liste todos los efectores, de momento solo mostramos hospitales */
    this.hospitalService.list().subscribe(data => {
      this.efectores = data;
    }, error => {
      console.log(error);
    });
  }

  listCargos(): void {
    this.cargoService.list().subscribe(data => {
      this.cargos = data;
    }, error => {
      console.log(error);
    });
  }
  listEspecialidades(): void {
    this.especialidadService.list().subscribe(data => {
      this.especialidades = data;
    }, error => {
      console.log(error);
    });
  }

  saveLegajo(): void {
    if (this.legajoForm.valid) {
      const legajoData = this.legajoForm.value;
      const legajoDto = new LegajoDto(
        legajoData.fechaInicio,
        legajoData.fechaFinal,
        legajoData.actual,
        legajoData.legal,
        legajoData.activo,
        legajoData.matriculaNacional,
        legajoData.matriculaProvincial,
        legajoData.revista.id,
        legajoData.udo.id,
        legajoData.persona.id,
        legajoData.cargo.id,
        legajoData.efectores,
        legajoData.especialidades,
        legajoData.profesion.id
      );

      console.log("id efectores###", legajoDto)
      /* AYUDA: si this.data tiene un valor y un ID asociado */
      if (this.data && this.data.id) {
        this.legajoService.update(this.data.id, legajoDto).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {

        this.legajoService.save(legajoDto).subscribe(
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

  comparePersona(p1: Asistencial, p2: Asistencial): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareProfesion(p1: Profesion, p2: Profesion): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareRevista(p1: Revista, p2: Revista): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareUdo(p1: Efector, p2: Efector): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareEfector(p1: Efector, p2: Efector): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareCargo(p1: Cargo, p2: Cargo): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancel(): void {
    this.dialogRef.close();
  }
}