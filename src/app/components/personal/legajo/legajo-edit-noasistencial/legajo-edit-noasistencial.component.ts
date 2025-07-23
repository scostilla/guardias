import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LegajoDto } from 'src/app/dto/Configuracion/LegajoDto';
import { Adicional } from 'src/app/models/Configuracion/Adicional';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { CargaHoraria } from 'src/app/models/Configuracion/CargaHoraria';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { Categoria } from 'src/app/models/Configuracion/Categoria';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Especialidad } from 'src/app/models/Configuracion/Especialidad';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { Profesion } from 'src/app/models/Configuracion/Profesion';
import { Region } from 'src/app/models/Configuracion/Region';
import { Revista } from 'src/app/models/Configuracion/Revista';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { TipoRevista } from 'src/app/models/Configuracion/TipoRevista';
import { AdicionalService } from 'src/app/services/Configuracion/adicional.service';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { CargaHorariaService } from 'src/app/services/Configuracion/carga-horaria.service';
import { CargoService } from 'src/app/services/Configuracion/cargo.service';
import { CategoriaService } from 'src/app/services/Configuracion/categoria.service';
import { EspecialidadService } from 'src/app/services/Configuracion/especialidad.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { ProfesionService } from 'src/app/services/Configuracion/profesion.service';
import { RevistaService } from 'src/app/services/Configuracion/revista.service';
import { TipoRevistaService } from 'src/app/services/Configuracion/tipo-revista.service';
import { TipoGuardiaService } from 'src/app/services/Configuracion/tipoGuardia.service';




interface Agrup {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-legajo-edit-noasistencial',
  templateUrl: './legajo-edit-noasistencial.component.html',
  styleUrls: ['./legajo-edit-noasistencial.component.css']
})
export class LegajoEditNoasistencialComponent implements OnInit {

  fromLegajoPerson: boolean = false;
  fromLegajo: boolean = false;
  legajoForm: FormGroup;
  initialData: Legajo | undefined;
  idLegajo: number = 0;
  profesiones: Profesion[] = [];
  efectores: Efector[] = [];
  especialidadesList: Especialidad[] = [];
  categorias: Categoria[] = [];
  adicionales: Adicional[] = [];
  cargasHorarias: CargaHoraria[] = [];
  tiposRevistas: TipoRevista[] = [];
  revistas: Revista[] = [];
  tipoGuardias: TipoGuardia[] = [];
  cargos: Cargo[] = [];
  regiones: Region[] = [];

  step = 0;
  maxDate!: Date;
  minFechaFinal!: Date;
  showGuardia: boolean = false;
  showRegion: boolean = false;


  personId!: number;
  asistencial: Asistencial | undefined;
  noAsistencial: NoAsistencial | undefined;
  isAsistencial: boolean = false;
  noEspecialidadesMessage: string = '';
  isSituacionRevistaEnabled = false;
  isUpdatingTipoGuardias: boolean = false;
  filteredCargasHorarias: CargaHoraria[] = [];


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
    private regionService: CargoService,
    private especialidadService: EspecialidadService,
    private categoriaService: CategoriaService,
    private adicionalService: AdicionalService,
    private cargaHorariaService: CargaHorariaService,
    private tipoRevistaService: TipoRevistaService,
    private revistaService: RevistaService,
    private tipoGuardiaService: TipoGuardiaService,
    private toastr: ToastrService
  ) {
    this.legajoForm = this.fb.group({
      persona: ['', Validators.required],
      udo: ['', Validators.required],
      efectores: ['', Validators.required],
      esAutoridad: ['', Validators.required],
      idCargo: [null],
      idRegion: [null],
      fechaInicio: ['', [Validators.required, this.dateLimitePresente]],
      fechaFinal: [{ value: '', disabled: true }],
    });

        //-----Manejo de fechas-----

        this.maxDate = new Date();
    
        // Deshabilitar fechaFinal hasta que se seleccione fechaInicio
        this.legajoForm.get('fechaFinal')?.disable();
      
        // Habilitar fechaFinal cuando fechaInicio tiene un valor
        this.legajoForm.get('fechaInicio')?.valueChanges.subscribe(fechaInicio => {
          if (fechaInicio) {
            this.legajoForm.get('fechaFinal')?.enable();
        
            // valor mínimo de fechaFinal, día siguiente a fechaInicio
            const fechaInicioDate = new Date(fechaInicio);
            fechaInicioDate.setDate(fechaInicioDate.getDate() + 1);
            this.minFechaFinal = fechaInicioDate;
        
            // Reseteo fechaFinal en caso se modifique fechaInicio
            this.legajoForm.get('fechaFinal')?.setValue('');
          } else {
            this.legajoForm.get('fechaFinal')?.disable();
            this.legajoForm.get('fechaFinal')?.setValue('');
          }
        });
  

    this.listUdos();
    this.listCargo();
    this.listRegion();


  // recupero el estado del router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.isAsistencial = !!navigation.extras.state['asistencial'];
      
      this.initialData = navigation.extras.state['legajo'];
      this.fromLegajoPerson = !!navigation.extras.state['fromLegajoPerson'];
      this.fromLegajo = !!navigation.extras.state['fromLegajo'];
  
      // Determina si es asistencial o no asistencial
      this.asistencial = navigation.extras.state['asistencial'] || undefined;
      this.noAsistencial = navigation.extras.state['noAsistencial'] || undefined;
  
    }
  }

  ngOnInit(): void {
    // Verifica si hay datos iniciales
    if (this.initialData) {
      this.idLegajo = this.initialData.id ?? 0;
  
      // Verifica si el ID de la persona es undefined
      if (this.initialData.persona?.id === undefined) {
        this.toastr.warning('ID de la persona no encontrado. Regresando a página de legajos.', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.router.navigate(['/personal-legajo']);
        return;
      }
  
      this.personId = this.initialData.persona.id;
  
      // Carga los datos del formulario
      this.legajoForm.patchValue({
        ...this.initialData,
        efectores: this.initialData.efectores ? this.initialData.efectores.map((efector: any) => efector.id) : [],
        cargo: this.initialData.cargo?.id,
        region: this.initialData.region?.id,
      });

  
    }
    this.legajoForm.get('esAutoridad')?.disable();
  }

  //-----Metodos y funciones-----

  // Form Datos profesional: No permite seleccionar una fecha futura en fechaInicio
  dateLimitePresente(control: any) {
    const currentDate = new Date();
    if (control.value && new Date(control.value) > currentDate) {
      return { 'matDatepickerMin': true };
    }
    return null;
  }

  //Form Datos profesional: Habilita la fecha minima para fechaFinalizacion
  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
  }

    //Form Datos legajo: si es un legajo tipo autoridad (esAutoridad) impide cargar tipoGuardia y habilita cargo
    onAutoridadChange(isAutoridad: boolean): void {
      const idCargoControl = this.legajoForm.get('idCargo');
      const idRegionControl = this.legajoForm.get('idRegion');
      
      // Cuando cambia idAutoridad reseteo el valor de idCargo, tipoGuardia e idRegion; tambien oculto y hago no obligatorio idRegional
      idCargoControl?.reset();
      idRegionControl?.reset();
      this.showRegion = false;
      this.legajoForm.get('idRegion')?.clearValidators();
      
      // Mostrar/ocultar el campo 'idCargo' y tipoGuardia basado en 'esAutoridad'
      if (isAutoridad) {
        // Si es autoridad muestro idCargo y oculto tipoGuardia y situacion de revista
        idCargoControl?.enable();
        this.legajoForm.get('idCargo')?.setValidators([Validators.required]);
      } else {
        // Si no es autoridad oculto idCargo y muestro tipoGuardia haciendola obligatoria
        idCargoControl?.disable();
        idCargoControl?.clearValidators(); // Remuevo validadores si no es autoridad
      }
    
      // Actualizo la validez de los campos después de modificar los validadores y visibilidad
      idCargoControl?.updateValueAndValidity();
    }
    
    onCargoChange(): void {
      const cargoSeleccionado = this.legajoForm.get('idCargo')?.value;
      const idRegionControl = this.legajoForm.get('idRegion');
      const directorRegionalNombre = 'Director Regional'; 
  
      if (cargoSeleccionado === directorRegionalNombre) {
        // Si se selecciona "Director regional", muestra el campo de región y lo hace obligatorio
        this.showRegion = true;
        this.legajoForm.get('idRegion')?.setValidators([Validators.required]);
      } else {
        // Si se selecciona cualquier otro cargo, oculta el campo de región y lo hace inválido
        this.showRegion = false;
        idRegionControl?.reset();
        this.legajoForm.get('idRegion')?.clearValidators();
      }
  
      // Actualiza la validez de los campos
      this.legajoForm.get('idRegion')?.updateValueAndValidity();
    }  

  listUdos(): void {
    /* aqui falta agregar metodo en back para que liste todos los efectores, de momento solo mostramos hospitales */
    this.hospitalService.list().subscribe(data => {
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

  listRegion(): void {
    this.regionService.list().subscribe(data => {
      this.regiones = data;
    }, error => {
      console.log(error);
    });
  }

  updateLegajo(): void {
    // Obtener los valores del formulario
    const legajoData = this.legajoForm.value;
    
    legajoData.esAutoridad = this.legajoForm.get('esAutoridad')?.value;
    const esRegional = legajoData.idCargo === 'Director Regional' ? true : false;

    const legajoDto = new LegajoDto(
      legajoData.fechaInicio,
      legajoData.esAutoridad,
      true,
      legajoData.url,
      this.personId,
      legajoData.fechaFinal,
      esRegional,
      null, //matricula nacional
      null, //matricula provincial                          
      null, // idSuspencion
      null, //motivoBaja
      null, //id revista
      legajoData.udo?.id ?? null,
      legajoData.efectores ?? null,
      null, //especialidad
      null, //profesion
      null, //tipo guardia
      legajoData.idCargo ?? null,
      legajoData.idRegion ?? null,
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

      if (this.asistencial) {
        this.router.navigate(['/personal-legajo-select'], {
          state: { asistencial: this.asistencial, fromAsistencial: true }
        });
      } else if (this.noAsistencial) {
        this.router.navigate(['/personal-legajo-select'], {
          state: { noAsistencial: this.noAsistencial, fromNoAsistencial: true }
        });
      } else {
        this.router.navigate(['/personal-legajo-select']);
      }
    },
    (error) => {
      this.toastr.error('Ocurrió un error al editar el Legajo', error, {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      console.error('Error al editar el legajo', error);
    }
  );
}

  cancel(): void { 
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    
    console.log('Cancelando. NoAsistencial:', this.noAsistencial);
  
    if (this.asistencial) {
      this.router.navigate(['/personal-legajo-select'], {
        state: { asistencial: this.asistencial, fromAsistencial: true }
      });
    } else if (this.noAsistencial) {
      this.router.navigate(['/personal-legajo-select'], {
        state: { noAsistencial: this.noAsistencial, fromNoAsistencial: true }
      });
    } else {
      console.error('No se encontró el objeto asistencial ni el objeto no asistencial.');
    }
  }
          
  compareFn(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  compareFn_id(o1: any, o2: any): boolean {
    return o1 && o2 ? o1 === o2 : o1 === o2;
  }
}