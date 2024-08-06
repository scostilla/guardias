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
import { RevistaDto } from 'src/app/dto/Configuracion/RevistaDto';

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

    this.legajoForm = this.fb.group({
      agrupacion: ['', Validators.required],
      categoria: ['', Validators.required],
      adicional: ['', Validators.required],
      cargaHoraria: ['', Validators.required],
      tipoRevista: ['', Validators.required],
      persona: ['', Validators.required],
      profesion: ['', Validators.required],
      //revista: [''],
      udo: ['', Validators.required],
      efectores: [[]],
      especialidades: [[]],
      matriculaNacional: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9. ]{5,20}$')]],
      matriculaProvincial: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9. ]{5,20}$')]],
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
    { value: 'ADMINISTRATIVO', viewValue: 'Administrativo' },
    { value: 'MANTENIMIENTO_Y_PRODUCCION', viewValue: 'Mantenimiento y Producción' },
    { value: 'PROFESIONALES', viewValue: 'Profesionales' },
    { value: 'SERVICIOS_GENERALES', viewValue: 'Servicios Generales' },
    { value: 'TECNICOS', viewValue: 'Técnicos' },
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

  saveLegajo(): void {
    if (this.legajoForm.valid) {
      const legajoData = this.legajoForm.value;

      const revistaDto = new RevistaDto(
        legajoData.tipoRevista,
        legajoData.categoria,
        legajoData.adicional,
        legajoData.cargaHoraria,
        legajoData.agrupacion
      );
      // Verifica si existe una revista con los atributos especificados
      this.revistaService.checkRevista(revistaDto).subscribe(
        (existingRevista) => {
          // Si existe, usa su ID
          if (existingRevista && existingRevista.id !== undefined) {
            this.createLegajoDtoAndSave(legajoData, existingRevista.id);
        } else {
          console.error('La revista existente no tiene un ID.');
      }
        },
        (error) => {
          // Si no existe, crea una nueva revista
          console.log('##### Revista no encontrada, creando una nueva.');
          this.revistaService.save(revistaDto).subscribe(
            () => {
              // Una vez creada, busca la revista nuevamente
              this.revistaService.checkRevista(revistaDto).subscribe(
                (newRevista) => {
                  if (newRevista && newRevista.id !== undefined) {
                    console.log('%%%Nueva revista creada y encontrada:', newRevista);
                    this.createLegajoDtoAndSave(legajoData, newRevista.id);
                  } else {
                    console.error('Error: No se pudo encontrar la nueva revista después de crearla.');
                  }
                },
                (error) => {
                  console.error('Error al buscar la revista después de crearla', error);
                }
              );
            },
            (error) => {
              console.error('%%%%%%%Error al crear la revista', error);
            }
          );
        }
      );
    }
  }

  createLegajoDtoAndSave(legajoData: any, revistaId: number): void {
    const legajoDto = new LegajoDto(
      legajoData.fechaInicio,
      legajoData.fechaFinal,
      legajoData.actual,
      legajoData.legal,
      legajoData.activo,
      legajoData.matriculaNacional,
      legajoData.matriculaProvincial,
      revistaId, // Usa el ID de la revista (existente o nueva)
      legajoData.udo.id,
      legajoData.persona.id,
      legajoData.cargo.id,
      legajoData.efectores,
      legajoData.especialidades,
      legajoData.profesion.id
    );
  
    console.log("#### legajoDto que viene ", legajoDto);
    console.log("#### legajoDto id de la revista  ", legajoDto.idRevista);
    console.log("#### data y data.id ", this.data);
  
    this.saveOrUpdateLegajo(legajoDto);
  }


  saveOrUpdateLegajo(legajoDto: LegajoDto): void {

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