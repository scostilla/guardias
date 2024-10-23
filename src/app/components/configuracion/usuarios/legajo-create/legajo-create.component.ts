import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { LegajoDto } from 'src/app/dto/Configuracion/LegajoDto';
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
import { ToastrService } from 'ngx-toastr';
import { RevistaDto } from 'src/app/dto/Configuracion/RevistaDto';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialSelectorComponent } from '../asistencial-selector/asistencial-selector.component';
import { MatDialog } from '@angular/material/dialog';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';

interface Agrup {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-legajo-create',
  templateUrl: './legajo-create.component.html',
  styleUrls: ['./legajo-create.component.css']
})
export class LegajoCreateComponent implements OnInit {

  fromAsistencial: boolean = false;
  fromNoAsistencial: boolean = false;
  inputValue: string = '';
  //selectedAsistencial?: Asistencial;
  legajoForm: FormGroup;
  initialData: Asistencial | NoAsistencial | undefined;
  //personas: AsistencialListForLegajosDto[] = [];

  // Para guardar la persona seleccionada que viene desde AsistencialComponent
  //selectedPersona: AsistencialListDto | null = null;
  profesiones: Profesion[] = [];
  efectores: Efector[] = [];
  cargos: Cargo[] = [];
  especialidades: Especialidad[] = [];
  categorias: Categoria[] = [];
  adicionales: Adicional[] = [];
  cargasHorarias: CargaHoraria[] = [];
  tiposRevistas: TipoRevista[] = [];

  /* Form de revista */
  agrupaciones: Agrup[] = [
    { value: 'ADMINISTRATIVO', viewValue: 'Administrativo' },
    { value: 'MANTENIMIENTO_Y_PRODUCCION', viewValue: 'Mantenimiento y Producción' },
    { value: 'PROFESIONALES', viewValue: 'Profesionales' },
    { value: 'SERVICIOS_GENERALES', viewValue: 'Servicios Generales' },
    { value: 'TECNICOS', viewValue: 'Técnicos' },
  ];

  step = 0;
  isAsistencial: boolean = false;


  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private legajoService: LegajoService,
    private router: Router,
    private profesionService: ProfesionService,
    //private asistencialService: AsistencialService,
    private hospitalService: HospitalService,
    private cargoService: CargoService,
    private especialidadService: EspecialidadService,
    private categoriaService: CategoriaService,
    private adicionalService: AdicionalService,
    private cargaHorariaService: CargaHorariaService,
    private tipoRevistaService: TipoRevistaService,
    private revistaService: RevistaService,
    private toastr: ToastrService,
  ) {

    this.legajoForm = this.fb.group({
      agrupacion: ['', Validators.required],
      categoria: ['', Validators.required],
      adicional: ['', Validators.required],
      cargaHoraria: ['', Validators.required],
      tipoRevista: ['', Validators.required],
      idPersona: ['', Validators.required],
      profesion: ['', Validators.required],
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


    // recupera el estado del router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      // Verifica si viene de Asistencial o NoAsistencial
      this.fromAsistencial = !!navigation.extras.state['fromAsistencial'];
      this.fromNoAsistencial = !!navigation.extras.state['fromNoAsistencial'];

      // Asigno los datos a initialData basado en fromAsistencial o fromNoAsistencial
      if (this.fromAsistencial) {
        this.initialData = navigation.extras.state['asistencial'] as Asistencial;
      } else if (this.fromNoAsistencial) {
        this.initialData = navigation.extras.state['noAsistencial'] as NoAsistencial;
      }
    }
  }

  ngOnInit(): void {
    // Si hay datos iniciales quito la validación
    if (this.initialData) {

      this.legajoForm.get('idPersona')?.clearValidators(); // Quita la validación
      this.inputValue = `${this.initialData.apellido} ${this.initialData.nombre}`;
      this.legajoForm.patchValue({ idPersona: this.initialData.id }); // Carga el id del asistencial/noAsistencial
    }

    this.listProfesiones();
    this.listUdos();
    this.listCargos();
    this.listEspecialidades();
    this.listCategorias();
    this.listAdicionales();
    this.listCargaHoraria();
    this.listTipoRevista();

  }

  /*openAsistencialDialog(): void {
    const dialogRef = this.dialog.open(AsistencialSelectorComponent, {
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizo el valor legible para mostrarlo y el id para el formulario
        this.inputValue = `${result.apellido} ${result.nombre}`;
        this.legajoForm.patchValue({ idPersona: result.id });
      } else {
        this.toastr.info('No se seleccionó un profesional', 'Información', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }, error => {
      this.toastr.error('Ocurrió un error al abrir el diálogo de Asistencial', 'Error', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      console.error('Error al abrir el diálogo de carga de profesional:', error);
    });
  }*/

  /* listAsistenciales(): void {

    this.asistencialService.listForLegajosDtos().subscribe(data => {
      this.personas = data;
      //console.log('Datos recibidos:', this.personas);

      if (this.selectedPersona) {
        const selectedId = this.selectedPersona.id;
        if (!this.personas.find(p => p.id === selectedId)) {
          this.personas.push(this.selectedPersona as AsistencialListDto);
        }
      }
    }, error => {
      console.log(error);
    });
  } */

  /*  setupFormValueChanges(): void {
     this.legajoForm.get('persona')?.valueChanges.subscribe((selectedPersona: AsistencialListDto) => {
       if (selectedPersona) {
         this.selectedPersona = selectedPersona;
         this.checkTipoGuardia(selectedPersona);
       }
     });
   } */

  /* checkTipoGuardia(persona: AsistencialListDto): void {
    if (persona.nombresTiposGuardias && persona.nombresTiposGuardias.includes('CONTRAFACTURA')) {
      this.isContrafactura = true;
      // Limpiar validadores de los campos que no son necesarios para CONTRAFACTURA
    this.legajoForm.get('agrupacion')?.clearValidators();
    this.legajoForm.get('categoria')?.clearValidators();
    this.legajoForm.get('adicional')?.clearValidators();
    this.legajoForm.get('cargaHoraria')?.clearValidators();
    this.legajoForm.get('tipoRevista')?.clearValidators();
    this.legajoForm.get('udo')?.clearValidators();
    this.legajoForm.get('cargo')?.clearValidators();
    } else {
      this.isContrafactura = false;
      // Restablecer validadores en caso de que no sea CONTRAFACTURA
    this.legajoForm.get('agrupacion')?.setValidators(Validators.required);
    this.legajoForm.get('categoria')?.setValidators(Validators.required);
    this.legajoForm.get('adicional')?.setValidators(Validators.required);
    this.legajoForm.get('cargaHoraria')?.setValidators(Validators.required);
    this.legajoForm.get('tipoRevista')?.setValidators(Validators.required);
    this.legajoForm.get('udo')?.setValidators(Validators.required);
    this.legajoForm.get('cargo')?.setValidators(Validators.required);
    }

    // Actualizar el estado de los campos en el formulario
  this.legajoForm.get('agrupacion')?.updateValueAndValidity();
  this.legajoForm.get('categoria')?.updateValueAndValidity();
  this.legajoForm.get('adicional')?.updateValueAndValidity();
  this.legajoForm.get('cargaHoraria')?.updateValueAndValidity();
  this.legajoForm.get('tipoRevista')?.updateValueAndValidity();
  this.legajoForm.get('udo')?.updateValueAndValidity();
  this.legajoForm.get('cargo')?.updateValueAndValidity();
  } */

  /* isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.legajoForm.value);
  } */

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

  /* saveLegajo(): void {
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
        legajoData.tipoRevista.id,
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
            this.toastr.success('Legajo actualizado exitosamente!', 'Actualización Exitosa', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
            this.router.navigate(['/legajo']);
          },
          error: (error) => {
            this.toastr.error('Error al actualizar el legajo.', 'Error', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
            console.error('Error al actualizar el legajo', error);
          }
        });
      } else {
        this.legajoService.save(legajoDto).subscribe({
          next: (result) => {
            this.toastr.success('Legajo creado exitosamente!', 'Creación Exitosa', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
            this.router.navigate(['/legajo']);
          },
          error: (error) => {
            this.toastr.error('Error al crear el legajo.', 'Error', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
            console.error('Error al crear el legajo', error);
          }
        });
      }
    } else {
      this.toastr.warning('Por favor complete todos los campos requeridos.', 'Formulario Incompleto', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
    }
  } */

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
            console.log("fecha que tiene ", legajoData.fechaInicio)
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
      //}
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
      revistaId!, // Usa el ID de la revista (existente o nueva)
      legajoData.udo.id,
      legajoData.idPersona,
      legajoData.cargo.id,
      legajoData.efectores,
      legajoData.especialidades,
      legajoData.profesion.id
    );

    console.log("dto creado para guardar", legajoDto);

    this.legajoService.save(legajoDto).subscribe(
      (result) => {
        this.toastr.success('Legajo creado con éxito', 'EXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        // Redirige según de dónde vino
        if (this.fromAsistencial) {
          this.router.navigate(['/personal']);
        } else if (this.fromNoAsistencial) {
          this.router.navigate(['/personal-no-asistencial']);
        } else {
          this.router.navigate(['/personal-legajo']);
        }
      },
      (error) => {
        this.toastr.error('Ocurrió un error al crear el Legajo', error, {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
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
    const panel1Controls = ['idPersona', 'profesion', 'especialidades', 'cargo', 'matriculaNacional', 'matriculaProvincial'];
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

  cerrarPanel() {
    this.step = -1;
  }

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    // Redirige según de dónde vino
    if (this.fromAsistencial) {
      this.router.navigate(['/personal']);
    } else if (this.fromNoAsistencial) {
      this.router.navigate(['/personal-no-asistencial']);
    } else {
      this.router.navigate(['/personal-legajo']);
    }
  }

  compareFn(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}