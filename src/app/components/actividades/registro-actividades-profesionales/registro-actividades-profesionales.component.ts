import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ServicioSummaryDto } from 'src/app/dto/Configuracion/ServicioSummaryDto';
import { RegActivAsistenciaDto } from 'src/app/dto/RegistroActividad/RegActivAsistenciaDto';
import { RegActivNombresDto } from 'src/app/dto/RegistroActividad/RegActivNombresDto';
import { RegistroMensualListDto } from 'src/app/dto/RegistroMensualListDto';
import { AsistencialMode } from 'src/app/enums/asistencial-mode';
import { Feriado } from 'src/app/models/Configuracion/Feriado';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { TokenService } from 'src/app/services/login/token.service';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { AsistencialFiltradoSelectorComponent } from '../../personal/personal-contenido/asistencial-selector/asistencial-filtrado-selector/asistencial-filtrado-selector.component';

@Component({
    selector: 'app-registro-actividades-profesionales',
    templateUrl: './registro-actividades-profesionales.component.html',
    styleUrls: ['./registro-actividades-profesionales.component.css']
})
export class RegistroActividadesProfesionalesComponent {

    efectorId: number | null = null;
    efectorNombre: string | null = null;
    initialData: any;
    inputValue: string = '';
    registroForm: FormGroup;
    currentDate: Date = new Date();
   

    displayedColumns: string[] = ['asistencial', 'fechaIngreso', 'horaIngreso', 'servicio', 'tipoGuardia'];
      dataSource = new MatTableDataSource<RegActivNombresDto>();
    
      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;

        suscription!: Subscription;
        tablaListaParaMostrar = false;
      
        diasEnMes: moment.Moment[] = [];
        feriados: Feriado[] = [];
        registrosMensuales: RegistroMensualListDto[] = [];
        servicios: ServicioSummaryDto[] = []; 
        actividades: RegActivAsistenciaDto[] = [];
        tablaDias: {
          fecha: string,
          entradas: { hora: string, tipoGuardia: string }[],
          salidas: { hora: string, tipoGuardia: string }[]
        }[] = [];
        tablaFilas: {
          fecha: string,
          entrada: string | null,
          salida: string | null,
          tipoGuardia: string,
          servicio?: string
        }[] = [];

      get uniqueFechas(): string[] {
        // Devuelve las fechas únicas ordenadas
        return Array.from(new Set(this.tablaFilas.map(f => f.fecha))).sort();
      }

      //Autenticación
      isAdministrativo: boolean = false;
      isUsuario: boolean = false;
      isDph: boolean = false;
      isSuper: boolean = false;
      isAutoridad: boolean = false;
      userId: number | null = null;
      currentRole: string | null = null;
      showDetails: boolean = false;
      showTable = false;

      selectedServicio?: number | null = null; 
        selectedMonth: number = moment().month() + 1;
        selectedYear: number = moment().year();
        years: number[] = [2023, 2024, 2025];
        mesesDisponibles: { value: number, label: string }[] = [];
        selectedMonthYear: string = '';
        // mesesDisponibles: { value: string, label: string }[] = [];
      

    asistencialCuil: string | null = null;

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
            private paginatorIntl: MatPaginatorIntl,
            private hospitalService: HospitalService,
            private ministerioService: MinisterioService,
            private efectorService: EfectorService,
            private feriadoService: FeriadoService,
            private tokenService: TokenService,
            private toastr: ToastrService,
            private sanitizer: DomSanitizer,
            private router: Router,
            private route: ActivatedRoute,
            private registroActividadService: RegistroActividadService
  ) {
      this.currentDate = new Date();
  
      this.registroForm = this.fb.group({
        idAsistencial: ['', Validators.required],
        idServicio: ['', Validators.required],
        idEfector: [''],
        fechaIngreso: ['', Validators.required],
        eventStartTime: ['', Validators.required],
        eventEndTime: [{ value: '', disabled: true }, Validators.required]
      });
  
      this.route.data.subscribe(data => {
        this.initialData = data['initialData'];
        if (this.initialData) {
          this.registroForm.patchValue(this.initialData);
        }
      });
    }

  ngOnInit(): void {
    this.efectorId = this.efectorService.getCurrentEfectorId();
    // Establecer por defecto el mes y año actual ANTES de generar los meses disponibles
    this.selectedMonth = moment().month() + 1;
    this.selectedYear = moment().year();
    if (this.efectorId) {
            this.loadEfectorName();
              moment.locale('es');
              this.dataSource = new MatTableDataSource<RegActivNombresDto>([]);
              this.generarMesesDisponibles();
              this.loadHospitalDetails();
              this.selectedMonthYear = `${this.selectedMonth}-${this.selectedYear}`;
        
            this.feriadoService.list().subscribe((feriados: Feriado[]) => {
              this.feriados = feriados;
        });
    } else {
      this.toastr.warning('No seleccionaste un efector', 'Advertencia', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.router.navigateByUrl('/home-page');
    }

    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();
     if (!this.currentRole) {
        console.warn('No hay un rol seleccionado actualmente.');
      }
    });
  }

  UserRoles(): void {
    this.isUsuario = this.currentRole === 'ROLE_USER';
    this.isAdministrativo = this.currentRole === 'ROLE_ADMIN';
    this.isAutoridad = this.currentRole === 'ROLE_AUTORIDAD';
    this.isDph = this.currentRole === 'ROLE_DPH';
    this.isSuper = this.currentRole === 'ROLE_SUPERUSER';
  }

  loadHospitalDetails(): void {
      if (!this.efectorId) {
        console.error('No hay efectorId disponible');
        return;
      }
  
      this.hospitalService.getServiciosActivos(this.efectorId).subscribe(
        (servicios) => {
          this.servicios = servicios.map(s => new ServicioSummaryDto(s.id, s.descripcion));
          if (this.servicios.length > 0) {
          }
  
        },
        (error) => {
          console.error('Error al obtener servicios activos del hospital:', error);
        }
      );
    }

    loadEfectorName(): void {
    if (this.efectorId) {
      this.efectorService.getEfectorNombre(this.efectorId).subscribe({
        next: (efector) => this.efectorNombre = efector.nombre,
        error: (err) => {
          console.error('Error al obtener el efector:', err);
          this.efectorNombre = null;
        }
      });
    }
  }

  loadAsistenciaProfesional(): void {
    const idAsistencial = this.registroForm.get('idAsistencial')?.value;
    if (!idAsistencial || !this.efectorId || !this.selectedMonth || !this.selectedYear) {
      this.actividades = [];
      this.tablaFilas = [];
      return;
    }
    this.registroActividadService.listAsistenciaByProfesionalEfectorMesAnio(
      idAsistencial,
      this.efectorId,
      this.selectedMonth,
      this.selectedYear
    ).subscribe({
      next: (data) => {
        this.actividades = data;
        const filas: {
          fecha: string,
          entrada: string | null,
          salida: string | null,
          tipoGuardia: string,
          servicio?: string
        }[] = [];
        data.forEach(act => {
          const fechaIng = act.fechaIngreso instanceof Date ? act.fechaIngreso.toISOString().slice(0, 10) : act.fechaIngreso;
          const fechaEgr = act.fechaEgreso instanceof Date ? act.fechaEgreso.toISOString().slice(0, 10) : act.fechaEgreso;
          if (fechaIng === fechaEgr) {
            // Entrada y salida en la misma fecha: una sola fila
            filas.push({
              fecha: fechaIng,
              entrada: act.horaIngreso,
              salida: act.horaEgreso,
              tipoGuardia: act.tipoGuardia,
              servicio: act.servicio
            });
          } else {
            // Entrada y salida en fechas distintas: dos filas
            filas.push({
              fecha: fechaIng,
              entrada: act.horaIngreso,
              salida: null,
              tipoGuardia: act.tipoGuardia,
              servicio: act.servicio
            });
            if (act.fechaEgreso && act.horaEgreso) {
              filas.push({
                fecha: fechaEgr,
                entrada: null,
                salida: act.horaEgreso,
                tipoGuardia: act.tipoGuardia,
                servicio: act.servicio
              });
            }
          }
        });
        this.tablaFilas = filas.sort((a, b) => a.fecha.localeCompare(b.fecha));
      },
      error: (err) => {
        this.actividades = [];
        this.tablaFilas = [];
        this.toastr.error('No se pudo cargar la asistencia', 'Error');
        console.error(err);
      }
    });
  }

  openAsistencialDialog(): void {
      console.log("Datos enviados al diálogo:", {
        idEfector: this.efectorId,
        mode: AsistencialMode.INGRESO
      });
      const dialogRef = this.dialog.open(AsistencialFiltradoSelectorComponent, {
        width: '800px',
        disableClose: true,
        data: {
          idEfector: this.efectorId, // Pasar el idEfector desde el sessionStorage
          mode: AsistencialMode.INGRESO
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Actualizo el valor legible para mostrarlo y el id para el formulario
          this.inputValue = `${result.apellido} ${result.nombre}`;
          this.registroForm.patchValue({ idAsistencial: result.id });
          this.asistencialCuil = result.cuil || null; // <-- Actualiza el CUIL
          this.loadAsistenciaProfesional(); // <-- cargar asistencia al seleccionar profesional
        } else {
          this.toastr.info('No se seleccionó un profesional', 'Información', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.asistencialCuil = null;
          this.actividades = [];
        }
      }, error => {
        this.toastr.error('Ocurrió un error al abrir el diálogo de Asistencial', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        console.error('Error al abrir el diálogo de carga de profesional:', error);
      });
    }

  //Manejo fechas en select
  
    generarMesesDisponibles(): void {
      this.mesesDisponibles = [];
      for (let mes = 1; mes <= 12; mes++) {
        const fecha = moment({ year: this.selectedYear, month: mes - 1 });
        this.mesesDisponibles.push({
          value: mes,
          label: fecha.format('MMMM').toUpperCase()
        });
      }
      // Por defecto: mes y año actual
      this.selectedMonth = moment().month() + 1;
      this.selectedYear = moment().year();
    }

  onYearChange(): void {
  const mesActual = this.selectedMonth;
  this.generarMesesDisponibles();
  // Si el mes seleccionado existe en el nuevo año, lo mantiene; si no, selecciona enero
  if (this.mesesDisponibles.some(m => m.value === mesActual)) {
    this.selectedMonth = mesActual;
  } else {
    this.selectedMonth = 1;
  }
  // Aquí puedes cargar los datos correspondientes al mes/año
  this.loadAsistenciaProfesional(); // <-- cargar asistencia al cambiar año
}

onMonthChange(): void {
  // Aquí puedes cargar los datos correspondientes al mes/año
  this.loadAsistenciaProfesional(); // <-- cargar asistencia al cambiar mes
}

getFilasPorFecha(fecha: string) {
  return this.tablaFilas.filter(f => f.fecha === fecha);
}

 toggleAllDetails(): void {
    this.showDetails = !this.showDetails; // Alterna la visibilidad de los detalles
  }
  
}