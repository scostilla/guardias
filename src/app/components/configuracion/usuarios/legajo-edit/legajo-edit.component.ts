import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { LegajoDto } from 'src/app/dto/Configuracion/LegajoDto';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { ProfesionService } from 'src/app/services/Configuracion/profesion.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { CargoService } from 'src/app/services/Configuracion/cargo.service';
import { EspecialidadService } from 'src/app/services/Configuracion/especialidad.service';
import { CategoriaService } from 'src/app/services/Configuracion/categoria.service';
import { AdicionalService } from 'src/app/services/Configuracion/adicional.service';
import { CargaHorariaService } from 'src/app/services/Configuracion/carga-horaria.service';
import { TipoRevistaService } from 'src/app/services/Configuracion/tipo-revista.service';
import { RevistaService } from 'src/app/services/Configuracion/revista.service';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Profesion } from 'src/app/models/Configuracion/Profesion';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { Especialidad } from 'src/app/models/Configuracion/Especialidad';
import { Categoria } from 'src/app/models/Configuracion/Categoria';
import { Adicional } from 'src/app/models/Configuracion/Adicional';
import { CargaHoraria } from 'src/app/models/Configuracion/CargaHoraria';
import { TipoRevista } from 'src/app/models/Configuracion/TipoRevista';
import { Revista } from 'src/app/models/Configuracion/Revista';
import { ToastrService } from 'ngx-toastr'; // Importa ToastrService

// Define la interfaz Agrup
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
  esEdicion = false;
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
  revistas: Revista[] = [];
  step = 0;

  agrupaciones: Agrup[] = [
    { value: 'ADMINISTRATIVO', viewValue: 'Administrativo' },
    { value: 'MANTENIMIENTO_Y_PRODUCCION', viewValue: 'Mantenimiento y Producción' },
    { value: 'PROFESIONALES', viewValue: 'Profesionales' },
    { value: 'SERVICIOS_GENERALES', viewValue: 'Servicios Generales' },
    { value: 'TECNICOS', viewValue: 'Técnicos' },
  ];

  constructor(
    private fb: FormBuilder,
    private legajoService: LegajoService,
    private route: ActivatedRoute,
    private router: Router,
    private asistencialService: AsistencialService,
    private profesionService: ProfesionService,
    private hospitalService: HospitalService,
    private cargoService: CargoService,
    private especialidadService: EspecialidadService,
    private categoriaService: CategoriaService,
    private adicionalService: AdicionalService,
    private cargaHorariaService: CargaHorariaService,
    private tipoRevistaService: TipoRevistaService,
    private revistaService: RevistaService,
    private toastr: ToastrService // Inyecta ToastrService
  ) {
    this.legajoForm = this.fb.group({
      agrupacion: ['', Validators.required],
      categoria: ['', Validators.required],
      adicional: ['', Validators.required],
      cargaHoraria: ['', Validators.required],
      tipoRevista: ['', Validators.required],
      persona: ['', Validators.required],
      profesion: ['', Validators.required],
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
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const legajoId = params['id'];
      this.esEdicion = !!legajoId;

      if (this.esEdicion) {
        this.legajoService.detail(legajoId).subscribe({
          next: (legajo) => {
            this.initialData = legajo;
            this.legajoForm.patchValue({
              ...legajo,
              efectores: legajo.efectores ? legajo.efectores.map((efector: any) => efector.id) : [],
              especialidades: legajo.especialidades ? legajo.especialidades.map((especialidad: any) => especialidad.id) : []
            });
          },
          error: (err) => {
            console.error('Error al obtener el legajo', err);
          }
        });
      }

      this.loadDropdowns();
    });
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.legajoForm.value);
  }

  loadDropdowns(): void {
    this.asistencialService.list().subscribe(data => {
      this.personas = data;
    }, error => {
      console.error('Error al cargar personas', error);
    });

    this.profesionService.list().subscribe(data => {
      this.profesiones = data;
    }, error => {
      console.error('Error al cargar profesiones', error);
    });

    this.hospitalService.list().subscribe(data => {
      this.efectores = data;
    }, error => {
      console.error('Error al cargar efectores', error);
    });

    this.cargoService.list().subscribe(data => {
      this.cargos = data;
    }, error => {
      console.error('Error al cargar cargos', error);
    });

    this.especialidadService.list().subscribe(data => {
      this.especialidades = data;
    }, error => {
      console.error('Error al cargar especialidades', error);
    });

    this.categoriaService.list().subscribe(data => {
      this.categorias = data;
    }, error => {
      console.error('Error al cargar categorias', error);
    });

    this.adicionalService.list().subscribe(data => {
      this.adicionales = data;
    }, error => {
      console.error('Error al cargar adicionales', error);
    });

    this.cargaHorariaService.list().subscribe(data => {
      this.cargasHorarias = data;
    }, error => {
      console.error('Error al cargar cargas horarias', error);
    });

    this.tipoRevistaService.list().subscribe(data => {
      this.tiposRevistas = data;
    }, error => {
      console.error('Error al cargar tipos de revistas', error);
    });

    this.revistaService.list().subscribe(data => {
      this.revistas = data;
    }, error => {
      console.error('Error al cargar revistas', error);
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
        legajoData.tipoRevista.id, // Asegúrate de que esto es correcto
        legajoData.udo.id,
        legajoData.persona.id,
        legajoData.cargo.id,
        legajoData.efectores,
        legajoData.especialidades,
        legajoData.profesion.id
      );

      if (this.esEdicion) {
        this.legajoService.update(legajoData.id, legajoDto).subscribe({
          next: (result) => {
            this.toastr.success('Legajo actualizado exitosamente!', 'Actualización Exitosa', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            this.router.navigate(['/legajo']);
          },
          error: (error) => {
            this.toastr.error('Error al actualizar el legajo.', 'Error', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            console.error('Error al actualizar el legajo', error);
          }
        });
      } else {
        this.legajoService.save(legajoDto).subscribe({
          next: (result) => {
            this.toastr.success('Legajo creado exitosamente!', 'Creación Exitosa', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            this.router.navigate(['/legajo']);
          },
          error: (error) => {
            this.toastr.error('Error al crear el legajo.', 'Error', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            console.error('Error al crear el legajo', error);
          }
        });
      }
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigate(['/legajo']);
  }

  compareFn(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}
