import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { Profesion } from 'src/app/models/Configuracion/Profesion';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { Especialidad } from 'src/app/models/Configuracion/Especialidad';
import { Categoria } from 'src/app/models/Configuracion/Categoria';
import { Adicional } from 'src/app/models/Configuracion/Adicional';
import { CargaHoraria } from 'src/app/models/Configuracion/CargaHoraria';
import { TipoRevista } from 'src/app/models/Configuracion/TipoRevista';
import { Revista } from 'src/app/models/Configuracion/Revista';
import { ToastrService } from 'ngx-toastr';
import { AsistencialListForLegajosDto } from 'src/app/dto/Configuracion/asistencial/AsistencialListForLegajosDto';
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

  fromLegajoPerson: boolean = false;
  fromLegajo: boolean = false;
  legajoForm: FormGroup;
  initialData: Legajo | undefined;
  idLegajo: number = 0;
  personas: AsistencialListForLegajosDto[] = [];
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
    private toastr: ToastrService
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

    this.listAsistenciales();
    this.listProfesiones();
    this.listUdos();
    this.listCargos();
    this.listEspecialidades();
    this.listCategorias();
    this.listAdicionales();
    this.listCargaHoraria();
    this.listTipoRevista();

    // recupero el estado del router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.initialData = navigation.extras.state['legajo'];  // Recibo el legajo
      this.fromLegajoPerson = !!navigation.extras.state['fromLegajoPerson'];
      this.fromLegajo = !!navigation.extras.state['fromLegajo'];
    }

  }

  ngOnInit(): void {

    if (this.initialData) {
      console.log("legajo a modificar", this.initialData);
      console.log("categoria", this.initialData.revista?.categoria?.id);
      console.log("adicional", this.initialData.revista?.adicional?.id);
      console.log("cargaHoraria", this.initialData.revista?.cargaHoraria?.id);
      console.log("tipoRevista", this.initialData.revista?.tipoRevista?.id);
      this.idLegajo = this.initialData.id ?? 0;
      this.legajoForm.patchValue({
        ...this.initialData,
        efectores: this.initialData.efectores ? this.initialData.efectores.map((efector: any) => efector.id) : [],
        especialidades: this.initialData.especialidades ? this.initialData.especialidades.map((especialidad: any) => especialidad.id) : [],
        adicional: this.initialData.revista.adicional?.id,  // Cargar adicional del objeto 'Revista'
        agrupacion: this.initialData.revista?.agrupacion,  // Aquí cargas el valor de 'agrupacion'
        cargaHoraria: this.initialData.revista.cargaHoraria?.id,  // Cargar carga horaria del objeto 'Revista'
        categoria: this.initialData.revista?.categoria?.id ?? null,  // Cargar categoría del objeto 'Revista'
        tipoRevista: this.initialData.revista.tipoRevista?.id,  // Cargar tipo de revista del objeto 'Revista'

      });
    }
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.legajoForm.value);
  }

  listAsistenciales(): void {

    this.asistencialService.listForLegajosDtos().subscribe(data => {
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

  /* loadDropdowns(): void {
    this.asistencialService.list().subscribe(data => this.personas = data, error => console.error('Error al cargar personas', error));
    this.profesionService.list().subscribe(data => this.profesiones = data, error => console.error('Error al cargar profesiones', error));
    this.hospitalService.list().subscribe(data => this.efectores = data, error => console.error('Error al cargar efectores', error));
    this.cargoService.list().subscribe(data => this.cargos = data, error => console.error('Error al cargar cargos', error));
    this.especialidadService.list().subscribe(data => this.especialidades = data, error => console.error('Error al cargar especialidades', error));
    this.categoriaService.list().subscribe(data => this.categorias = data, error => console.error('Error al cargar categorias', error));
    this.adicionalService.list().subscribe(data => this.adicionales = data, error => console.error('Error al cargar adicionales', error));
    this.cargaHorariaService.list().subscribe(data => this.cargasHorarias = data, error => console.error('Error al cargar cargas horarias', error));
    this.tipoRevistaService.list().subscribe(data => this.tiposRevistas = data, error => console.error('Error al cargar tipos de revistas', error));
    this.revistaService.list().subscribe(data => this.revistas = data, error => console.error('Error al cargar revistas', error));
  } */

  updateLegajo(): void {
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
            console.log("carga horaria de la nueva revista ", existingRevista.cargaHoraria)
            this.createLegajoDtoAndUpdate(legajoData, existingRevista.id);
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
                    this.createLegajoDtoAndUpdate(legajoData, newRevista.id);
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

  createLegajoDtoAndUpdate(legajoData: any, revistaId: number): void {

    const legajoDto = new LegajoDto(
      legajoData.fechaInicio,
      legajoData.fechaFinal,
      legajoData.actual,
      legajoData.legal,
      legajoData.activo,
      legajoData.matriculaNacional,
      legajoData.matriculaProvincial,
      revistaId!, // Usa el ID de la revista (existente o nueva)
      legajoData.udo.id,
      legajoData.persona.id,
      legajoData.cargo.id,
      legajoData.efectores,
      legajoData.especialidades,
      legajoData.profesion.id
    );

    console.log("legajo a guardar ", legajoDto);
    console.log("id a modificar  ", this.idLegajo);

    this.legajoService.update(this.idLegajo, legajoDto).subscribe(
      (result) => {
        this.toastr.success('Legajo modificado con éxito', 'EXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

         // Redirige según de dónde vino
      if (this.fromLegajo) {
        this.router.navigate(['/legajo'], { state: { legajoModificado: result } });
      } else {
        this.router.navigate(['/legajo-person'], { state: { legajoModificado: result } });
      }

        //this.router.navigate(['/legajo'], { state: { legajoModificado: result } }); // Redirigir a la lista de legajos y pasar el legajo creado
      },
      (error) => {
        this.toastr.error(' Ocurrió un error al editar el Legajo', error, {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        console.error('Error al editar el legajo', error);
      }
    );
  }

  nextStep(): void {
    if (this.step === 0 && !this.isPanel1Valid()) {
      this.toastr.warning('Complete todos los campos obligatorios en datos personal.', 'Campos Incompletos', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
      return;
    }

    if (this.step === 1 && !this.isPanel2Valid()) {
      this.toastr.warning('Complete todos los campos obligatorios en situación de revista.', 'Campos Incompletos', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
      return;
    }

    if (this.step === 2 && !this.isPanel3Valid()) {
      this.toastr.warning('Complete todos los campos obligatorios en datos del legajo.', 'Campos Incompletos', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
      return;
    }

    this.step = (this.step + 1) % 3;  // Cambia 3 por el número total de pasos en el wizard
  }

  prevStep(): void {
    this.step = (this.step - 1 + 3) % 3;  // Cambia 3 por el número total de pasos en el wizard
  }

  isPanel1Valid(): boolean {
    // Verifica si los campos obligatorios en el panel 1 son válidos
    const panel1Controls = ['persona', 'profesion', 'especialidades', 'cargo', 'matriculaNacional', 'matriculaProvincial'];
    return panel1Controls.every(control => this.legajoForm.get(control)?.valid);
  }

  isPanel2Valid(): boolean {
    // Verifica si los campos obligatorios en el panel 2 son válidos
    const panel2Controls = ['agrupacion', 'categoria', 'adicional', 'cargaHoraria', 'tipoRevista', 'udo'];
    return panel2Controls.every(control => this.legajoForm.get(control)?.valid);
  }

  isPanel3Valid(): boolean {
    // Verifica si los campos obligatorios en el panel 3 son válidos
    const panel3Controls = ['actual', 'legal', 'fechaInicio'];
    return panel3Controls.every(control => this.legajoForm.get(control)?.valid);
  }

  setStep(index: number) {
    this.step = index;
  }

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });

    // Redirige según de dónde vino
    if (this.fromLegajo) {
      this.router.navigate(['/legajo']);
    } else {
      console.log("vuelvo a legajo-person", this.initialData);
      this.router.navigate(['/legajo-person'],{
        state:{legajoModificado: this.initialData}
      });
    }
    
    //this.router.navigate(['/legajo']);
  }

  compareFn(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  compareFn2(o1: any, o2: any): boolean {
    return o1 && o2 ? o1 === o2 : o1 === o2;
  }
}
