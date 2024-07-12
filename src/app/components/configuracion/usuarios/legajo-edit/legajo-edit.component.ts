import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { Profesion } from 'src/app/models/Configuracion/Profesion';
import { ProfesionService } from 'src/app/services/Configuracion/profesion.service';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { LegajoDto } from 'src/app/dto/Configuracion/LegajoDto';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { CargoService } from 'src/app/services/Configuracion/cargo.service';
import { EspecialidadService } from 'src/app/services/Configuracion/especialidad.service';
import { Especialidad } from 'src/app/models/Configuracion/Especialidad';
import { CategoriaService } from 'src/app/services/Configuracion/categoria.service';
import { Categoria } from 'src/app/models/Configuracion/Categoria';
import { AdicionalService } from 'src/app/services/Configuracion/adicional.service';
import { Adicional } from 'src/app/models/Configuracion/Adicional';
import { CargaHorariaService } from 'src/app/services/Configuracion/carga-horaria.service';
import { CargaHoraria } from 'src/app/models/Configuracion/CargaHoraria';
import { TipoRevistaService } from 'src/app/services/Configuracion/tipo-revista.service';
import { TipoRevista } from 'src/app/models/Configuracion/TipoRevista';
import { RevistaService } from 'src/app/services/Configuracion/revista.service';

interface Agrup {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-legajo-edit',
  templateUrl: './legajo-edit.component.html',
  styleUrls: ['./legajo-edit.component.css']
})
export class LegajoEditComponent implements OnInit {
  revistaForm: FormGroup;
  legajoForm: FormGroup;
  initialData: any;
  personas: Asistencial[] = [];
  profesiones: Profesion[] = [];
  efectores: Efector[] = [];
  cargos: Cargo[] = [];
  especialidades: Especialidad[] = [];
  categorias: Categoria[] = [];
  adicionales: Adicional[] = [];
  cargasHorarias: CargaHoraria[] = [];
  tiposRevistas: TipoRevista[] = [];

  revistaFormEnabled: boolean = true;


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LegajoEditComponent>,
    private legajoService: LegajoService,
    private profesionService: ProfesionService,
    private asistencialService: AsistencialService,
    private hospitalService: HospitalService,
    private cargoService: CargoService,
    private especialidadService: EspecialidadService,
    private categoriaService: CategoriaService,
    private adicionalService: AdicionalService,
    private cargaHorariaService: CargaHorariaService,
    private tipoRevistaService: TipoRevistaService,
    private revistaService: RevistaService,



    @Inject(MAT_DIALOG_DATA) public data: Legajo
  ) {
    this.revistaForm = this.fb.group({
      agrupacion: ['', Validators.required],
      categoria: ['', Validators.required],
      adicional: ['', Validators.required],
      cargaHoraria: ['', Validators.required],
      tipoRevista: ['', Validators.required],
    });

    this.legajoForm = this.fb.group({
      persona: ['', Validators.required],
      profesion: ['', Validators.required],
      revista: [''],
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
    this.listUdos();
    this.listCargos();
    this.listEspecialidades();
    this.listCategorias();
    this.listAdicionales();
    this.listCargaHoraria();
    this.listTipoRevista();


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

  /* Form de revista */

  agrupaciones: Agrup[] = [
    {value: 'ADMINISTRATIVO', viewValue: 'Administrativo'},
    {value: 'MANTENIMIENTO_Y_PRODUCCION', viewValue: 'Mantenimiento y Producción'},
    {value: 'PROFESIONALES', viewValue: 'Profesionales'},
    {value: 'SERVICIOS_GENERALES', viewValue: 'Servicios Generales'},
    {value: 'TECNICOS', viewValue: 'Técnicos'},
  ];

  listCategorias(): void {
    this.categoriaService.list().subscribe(data => {
      this.categorias = data;
    }, error => {
      console.log(error);
    });
  }

  listAdicionales(): void {
    this.adicionalService.list().subscribe(data => {
      this.adicionales = data;
    }, error => {
      console.log(error);
    });
  }

  listCargaHoraria(): void {
    this.cargaHorariaService.list().subscribe(data => {
      this.cargasHorarias = data;
    }, error => {
      console.log(error);
    });
  }

  listTipoRevista(): void {
    this.tipoRevistaService.list().subscribe(data => {
      this.tiposRevistas = data;
    }, error => {
      console.log(error);
    });
  }
  
  isLegajoFormValid(): boolean {
    return this.legajoForm.valid;
  }

  isRevistaFormValid(): boolean {
    return this.revistaForm.valid;
  }

  crearRevista(): void {
    if (this.isRevistaFormValid()) {
      const revistaData = this.revistaForm.value;
      this.revistaService.save(revistaData).subscribe(
        (response) => {
          this.legajoForm.patchValue({ revista: response.id }); // Asignar ID de la revista creada
          console.log('Revista creada exitosamente con ID:', response.id);
  
          // Deshabilitar el formulario de revista y habilitar el formulario de legajo
          this.revistaFormEnabled = false;
          this.legajoForm.enable();
        },
        (error) => {
          console.error('Error al crear la revista', error);
          // Manejar el error según tus necesidades
        }
      );
    } else {
      console.error('Formulario de revista inválido');
    }
  }

  isRevistaSelected(): boolean {
    return !!this.legajoForm.get('revista')?.value;
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

  compareTipoRevista(p1: TipoRevista, p2: TipoRevista): boolean {
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