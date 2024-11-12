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
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { TipoGuardiaService } from 'src/app/services/Configuracion/tipoGuardia.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Location } from '@angular/common';


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
  tipoGuardias: TipoGuardia[] = [];
  noEspecialidadesMessage: string = '';

  /* Form de revista */
  agrupaciones: Agrup[] = [
    { value: 'ADMINISTRATIVO', viewValue: 'Administrativo' },
    { value: 'PROFESIONALES', viewValue: 'Profesionales' },
    { value: 'SERVICIOS_GENERALES', viewValue: 'Servicios Generales' },
    { value: 'TECNICOS', viewValue: 'Técnicos' },
  ];

  step = 0;
  maxDate!: Date;
  minFechaFinal!: Date;
  isAsistencial: boolean = false;
  isSituacionRevistaEnabled = false;
  isAutoridad: boolean = false;


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
    private tipoGuardiaService: TipoGuardiaService,
    private revistaService: RevistaService,
    private toastr: ToastrService,
    private location: Location
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
      efectores: ['', Validators.required],
      especialidades: [[]],
      matriculaNacional: ['', [Validators.pattern('^[0-9]{5,10}$')]],
      matriculaProvincial: ['', [Validators.required, Validators.pattern('^[0-9]{5,10}$')]],
      esAutoridad: ['', Validators.required],
      fechaInicio: ['', [Validators.required, this.dateNotInFuture]],
      fechaFinal: [{ value: '', disabled: true }],
      tipoGuardias: ['', Validators.required],
    });

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

        // Escuchar cambios en 'esAutoridad'
        this.legajoForm.get('esAutoridad')?.valueChanges.subscribe(isAutoridad => {
          this.toggleTipoGuardia(isAutoridad);
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
    const personaId = this.initialData.id;
    this.inputValue = `${this.initialData.nombre} ${this.initialData.apellido}`;

    // Establecemos el valor de idPersona en el formulario
    this.legajoForm.get('idPersona')?.setValue(personaId);

    // Realizar las validaciones necesarias
    this.legajoForm.get('idPersona')?.updateValueAndValidity();
    
    console.log('ID de persona inicial:', personaId);

    // Verificar si idPersona está disponible y es un número válido
    if (personaId !== undefined && personaId !== null) {
      // Obtener todos los legajos y filtrar los activos
      this.legajoService.list().subscribe(legajos => {
        // Log para ver todos los legajos recibidos del backend
        console.log('Legajos obtenidos del backend:', legajos);

        // Filtramos los legajos activos para la persona
        const legajosActivos = legajos.filter(legajo => 
          legajo.persona?.id === personaId && legajo.activo
        );

        // Log para ver los legajos activos que se filtraron
        console.log('Legajos activos para la persona con ID:', personaId, legajosActivos);

        // Verificar si la persona es una autoridad
        this.legajoService.verificarAutoridad(personaId).subscribe(response => {
          console.log('Respuesta de verificarAutoridad:', response);
          
          const esAutoridad = response.mensaje === 'Este asistencial es una autoridad';
          this.isAutoridad = esAutoridad;
          
          if (esAutoridad) {
            // Si la persona es autoridad, verificar si tiene 2 legajos activos
            if (legajosActivos.length >= 2) {
              // Si ya tiene 2 legajos activos, mostramos un mensaje y redirigimos
              this.toastr.warning('Debe finalizar un legajo existente para poder realizar una nueva carga.', 'Limite de legajos alcanzado', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
              this.location.back();  // Redirigir a la página anterior
            } else if (legajosActivos.length === 1) {
              // Si tiene un solo legajo activo, verificar el valor de 'esAutoridad' del legajo
              const legajoActivo = legajosActivos[0];
              const esAutoridadActivo = legajoActivo.esAutoridad; // Suposición: 'esAutoridad' es un campo booleano en el legajo

              // Establecer el valor contrario de esAutoridad para el nuevo legajo
              if (esAutoridadActivo) {
                // Si el legajo activo tiene esAutoridad = true, solo se permite esAutoridad = false en el nuevo legajo
                this.legajoForm.get('esAutoridad')?.setValue(false);
              } else {
                // Si el legajo activo tiene esAutoridad = false, solo se permite esAutoridad = true en el nuevo legajo
                this.legajoForm.get('esAutoridad')?.setValue(true);
              }

              // Habilitar el campo esAutoridad para que el usuario pueda ver el cambio
              this.legajoForm.get('esAutoridad')?.disable();  // Deshabilitar campo porque ya tiene un legajo activo
              
              // Informar al usuario que ya posee un legajo y que solo puede cargar el tipo contrario
              this.toastr.info('La persona posee un legajo activo. Podrás cargar un tipo de legajo no existente.', 'Información', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
              
            } else {
              // Si no tiene legajos activos, podemos permitir elegir 'esAutoridad' como true o false
              this.legajoForm.get('esAutoridad')?.setValue(true);  // Establecer por defecto como true
              this.legajoForm.get('esAutoridad')?.enable();  // Habilitar el campo esAutoridad para elección
              this.toastr.info('La persona está registrada como autoridad.', 'Información', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
            }
          } else {
            // Si no es autoridad, verificar si tiene 1 legajo activo
            if (legajosActivos.length >= 1) {
              // Si ya tiene un legajo activo, mostramos un mensaje y redirigimos
              this.toastr.warning('Debe finalizar un legajo existente para poder realizar una nueva carga', 'Limite de legajos alcanzado', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
              this.location.back();  // Redirigir a la página anterior
            } else {
              // Si no tiene legajos activos, podemos proceder a cargar el formulario
              this.legajoForm.get('idPersona')?.setValidators([Validators.required]); // Vuelve a establecer la validación si es necesario
              this.legajoForm.get('idPersona')?.updateValueAndValidity(); // Asegúrate de que la validación sea evaluada
              this.toastr.info('La persona no está registrada como autoridad, solo puedes cargar un legajo general.', 'Información', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
              this.legajoForm.get('esAutoridad')?.setValue(false);  // Asegurar que esté en false
              this.legajoForm.get('esAutoridad')?.disable();  // Deshabilitar el campo esAutoridad
            }
          }
        }, error => {
          console.error('Error al verificar si la persona es autoridad:', error);
        });
      }, error => {
        console.error('Error al obtener los legajos:', error);
        // Aquí podrías manejar el error si es necesario
      });
    } else {
      console.error('ID de persona no disponible o no es válido');
    }
  }

  // Llamar a los métodos para cargar los datos iniciales
    this.listUdos();
    this.listCargos();
    this.listCategorias();
    this.listAdicionales();
    this.listCargaHoraria();
    this.listTipoRevista();
    this.listTipoGuardia();
  
    // Inicialización del formulario y deshabilitar el campo de especialidades al principio
    this.legajoForm.get('especialidades')?.disable();
  
    // Llamar a la función que lista las profesiones
    this.listProfesiones();
  
    // Cambiar especialidades cuando se cambia la profesión seleccionada
    this.legajoForm.get('profesion')?.valueChanges.subscribe((profesionId) => {
      if (profesionId) {
        // Filtrar especialidades por la profesión seleccionada
        this.filterEspecialidadesByProfesion(profesionId);
      } else {
        // Limpiar especialidades si no se ha seleccionado ninguna profesión
        this.especialidades = [];
        this.legajoForm.get('especialidades')?.disable(); // Deshabilitar especialidades si no hay profesión seleccionada
      }
    });
  
    // Borrar selección de especialidades si la profesión seleccionada no tiene especialidades
    this.legajoForm.get('profesion')?.valueChanges.subscribe((profesionId) => {
      const profesion = this.profesiones.find(p => p.id === profesionId);
  
      // Si la nueva profesión no tiene especialidades, limpiar la selección de especialidades
      if (profesion && !profesion.especialidades?.length) {
        this.legajoForm.get('especialidades')?.setValue([]);  // Limpiar la selección de especialidades
      }
    });
  }

dateNotInFuture(control: any) {
  const currentDate = new Date();
  if (control.value && new Date(control.value) > currentDate) {
    return { 'matDatepickerMin': true };  // Error: la fecha no puede ser futura
  }
  return null; // No hay error
}

    onDateChange(event: MatDatepickerInputEvent<Date>) {
      const selectedDate = event.value;
      console.log('Fecha seleccionada:', selectedDate);
    }
    
    toggleTipoGuardia(isAutoridad: boolean): void {
      const tipoGuardiasControl = this.legajoForm.get('tipoGuardias');
      
      if (isAutoridad) {
        // Si es Autoridad, ocultar el campo y desmarcar como obligatorio
        tipoGuardiasControl?.setValue([]);  // Cambiar a un array vacío en lugar de null
        tipoGuardiasControl?.clearValidators();  // Elimina la validación
        tipoGuardiasControl?.updateValueAndValidity();
      } else {
        // Si no es Autoridad, mostrar el campo y hacer obligatorio
        tipoGuardiasControl?.setValidators([Validators.required]);  // Hacer obligatorio
        tipoGuardiasControl?.updateValueAndValidity();
      }
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

  listProfesiones(): void {
    this.profesionService.list().subscribe(data => {
      this.profesiones = data;
    }, error => {
      console.log(error);
    });
  }

  listTipoGuardia(): void {
    this.tipoGuardiaService.list().subscribe(data => {
      this.tipoGuardias = data;
    }, error => {
      console.log(error);
    });
  }

  onTipoGuardiaSelectionChange(event: any): void {
    const selectedValues = this.legajoForm.get('tipoGuardias')!.value;
  
    // Si se selecciona el tipo 4 (CONTRAFACTURA), deseleccionar todas las demás opciones
    if (selectedValues.includes(4)) {
      this.legajoForm.patchValue({
        tipoGuardias: [4]  // Solo mantener el tipo 4
      });
    } else if (selectedValues.includes(5)) {
      // Si se selecciona el tipo 5 (PASIVA), deseleccionar todas las demás opciones
      this.legajoForm.patchValue({
        tipoGuardias: [5]  // Solo mantener el tipo 5
      });
    } else {
      // Si se seleccionan otras opciones (1, 2, 3), mantenerlas
      this.legajoForm.patchValue({
        tipoGuardias: selectedValues.filter((value: number) => value !== 4 && value !== 5)
      });
    }
  
    // Comprobar si se seleccionaron tipos de guardia 4 o 5 para deshabilitar el panel de Situación de Revista
    this.toggleSituacionRevista(selectedValues);
  }
  
  toggleSituacionRevista(selectedValues: number[]): void {
    // Si se selecciona el tipo 4 o 5, deshabilitar "Situación de Revista"
    if (selectedValues.length === 0 || selectedValues.includes(4) || selectedValues.includes(5)) {
      this.isSituacionRevistaEnabled = false;
      this.disableSituacionRevistaFields();
    } else {
      this.isSituacionRevistaEnabled = true;
      this.enableSituacionRevistaFields();
    }
  }
    
  disableSituacionRevistaFields(): void {
    this.legajoForm.get('agrupacion')?.disable();
    this.legajoForm.get('categoria')?.disable();
    this.legajoForm.get('adicional')?.disable();
    this.legajoForm.get('cargaHoraria')?.disable();
    this.legajoForm.get('tipoRevista')?.disable();
    this.legajoForm.get('udo')?.disable();
    this.legajoForm.get('efectores')?.disable();
  }
  
  enableSituacionRevistaFields(): void {
    this.legajoForm.get('agrupacion')?.enable();
    this.legajoForm.get('categoria')?.enable();
    this.legajoForm.get('adicional')?.enable();
    this.legajoForm.get('cargaHoraria')?.enable();
    this.legajoForm.get('tipoRevista')?.enable();
    this.legajoForm.get('udo')?.enable();
    this.legajoForm.get('efectores')?.enable();
  }
  
  filterEspecialidadesByProfesion(profesionId: number): void {
    this.especialidadService.list().subscribe(data => {
      this.especialidades = data.filter(especialidad => especialidad.profesion.id === profesionId);
  
      if (this.especialidades.length > 0) {
        this.legajoForm.get('especialidades')?.enable();
        this.noEspecialidadesMessage = '';
      } else {
        this.legajoForm.get('especialidades')?.disable();
        this.noEspecialidadesMessage = 'La profesión seleccionada no posee especialidades.';
      }
    }, error => {
      console.log('Error al cargar las especialidades:', error);
      this.legajoForm.get('especialidades')?.disable();
      this.noEspecialidadesMessage = 'Error al cargar las especialidades. Intente nuevamente.';
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

  saveLegajo(): void {
    if (this.legajoForm.valid) {
      const legajoData = this.legajoForm.value;
      
      // Verifica si el tipo de guardia incluye 4 (CONTRAFACTURA) o 5 (PASIVA)
      const tiposGuardiasSeleccionados = legajoData.tipoGuardias;
      const tiposGuardiaExcluidos = [4, 5];
      
      // Si los tipos 4 o 5 están seleccionados, no se guarda la revista
      if (tiposGuardiasSeleccionados.some((id: number) => tiposGuardiaExcluidos.includes(id))) {
        // Si se seleccionan 4 o 5, deshabilita el panel de revista (ya no necesita crearla)
        console.log('No se crea revista debido a tipos de guardia seleccionados: ', tiposGuardiasSeleccionados);
        
        // Crear legajo directamente sin pasar por la creación de la revista
        this.createLegajoDtoAndSave(legajoData, null);  // Aquí pasas `null`
      } else {
        // Si los tipos de guardia son válidos, proceder con la creación de la revista
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
            if (existingRevista && existingRevista.id !== undefined) {
              console.log("Revista encontrada:", existingRevista);
              // Usamos la ID de la revista existente
              this.createLegajoDtoAndSave(legajoData, existingRevista.id);
            } else {
              console.error('La revista existente no tiene un ID.');
            }
          },
          (error) => {
            console.log('Revista no encontrada, creando una nueva.');
            
            // Si no existe, crear una nueva revista
            this.revistaService.save(revistaDto).subscribe(
              () => {
                // Después de crearla, buscamos la revista
                this.revistaService.checkRevista(revistaDto).subscribe(
                  (newRevista) => {
                    if (newRevista && newRevista.id !== undefined) {
                      console.log('Nueva revista creada:', newRevista);
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
                console.error('Error al crear la revista', error);
              }
            );
          }
        );
      }
    }
  }
  
  createLegajoDtoAndSave(legajoData: any, revistaId: number | null): void {
      // Aseguro que 'efectores' sea un array ya que asi lo recibe el back sino da error
  if (legajoData.efectores && !Array.isArray(legajoData.efectores)) {
    legajoData.efectores = [legajoData.efectores];
  }

    const legajoDto = new LegajoDto(
      legajoData.fechaInicio,
      legajoData.esAutoridad,
      true,
      legajoData.matriculaNacional,
      legajoData.matriculaProvincial,
      legajoData.idPersona,
      legajoData.profesion,
      legajoData.fechaFinal,                
      null, // idSuspencion
      revistaId,
      legajoData.udo?.id ?? null,
      legajoData.efectores ?? null,
      legajoData.especialidades,
      legajoData.tipoGuardias
    );

    console.log("DTO creado para guardar legajo:", legajoDto);
  
    // Guardar el legajo sin la parte de revista si no corresponde
    this.legajoService.save(legajoDto).subscribe(
      (result) => {
        this.toastr.success('Legajo creado con éxito', 'EXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
  
        if (this.fromAsistencial) {
          this.router.navigate(['/personal']);
        } else if (this.fromNoAsistencial) {
          this.router.navigate(['/personal-no-asistencial']);
        } else {
          this.router.navigate(['/personal-legajo-select']);
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
      this.toastr.warning('Complete todos los campos obligatorios en datos del legajo.', 'Campos Incompletos', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
      return;
    }

    if (this.step === 2 && !this.isPanel3Valid()) {
      this.toastr.warning('Complete todos los campos obligatorios en situación de revista.', 'Campos Incompletos', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
      return;
    }

    this.step = (this.step + 1) % 3;
  }

  prevStep(): void {
    this.step = (this.step - 1 + 3) % 3;
  }

  isPanel1Valid(): boolean {
    const panel1Controls = ['idPersona', 'profesion', 'matriculaProvincial'];
    return panel1Controls.every(control => this.legajoForm.get(control)?.valid);
  }

  isPanel2Valid(): boolean {
    const panel2Controls = [/*'esAutoridad', */'fechaInicio', 'tipoGuardias'];
    return panel2Controls.every(control => this.legajoForm.get(control)?.valid);
  }

  isPanel3Valid(): boolean {
    const panel3Controls = ['agrupacion', 'categoria', 'adicional', 'cargaHoraria', 'tipoRevista', 'udo', 'efectores'];
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
    if (this.fromAsistencial) {
      this.location.back();
    } else if (this.fromNoAsistencial) {
      this.location.back();
    } else {
      this.router.navigate(['/personal-legajo-select']);
    }
  }

  compareFn(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}