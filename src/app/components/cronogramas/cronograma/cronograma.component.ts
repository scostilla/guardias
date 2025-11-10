import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay, CalendarView, CalendarModule, CalendarMonthModule, CalendarCommonModule, DateAdapter, CalendarWeekViewBeforeRenderEvent } from 'angular-calendar';
import { MonthViewDay } from 'calendar-utils';
import { MatDialog } from '@angular/material/dialog';
import { CronogramaCreateComponent } from '../cronograma-create/cronograma-create.component';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { CronogramaDetailComponent } from '../cronograma-detail/cronograma-detail.component';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { ServicioSummaryDto } from 'src/app/dto/Configuracion/ServicioSummaryDto';
import { Feriado } from 'src/app/models/Configuracion/Feriado'; 
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';
import { Subject, Subscription } from 'rxjs'; //no borrar, sirve para eventDeleted
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = (pdfFonts as any).vfs;


//Autenticación
import { TokenService } from 'src/app/services/login/token.service';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';

enum TipoGuardia {
  CARGO = 'CARGO',
  AGRUPACION = 'AGRUPACION',
  EXTRA = 'EXTRA',
  CONTRAFACTURA = 'CONTRAFACTURA'
}

// Mapeo de los colores según el tipo de guardia
const colorMapping: Record<TipoGuardia, { primary: string, secondary: string }> = {
  [TipoGuardia.CARGO]: { primary: '#6126cfff', secondary: '#c3a3ffff' },
  [TipoGuardia.AGRUPACION]: { primary: '#FF7F0E', secondary: '#f1cabaff' },
  [TipoGuardia.EXTRA]: { primary: '#D91E5B', secondary: '#cc889fff' },
  [TipoGuardia.CONTRAFACTURA]: { primary: '#769264', secondary: '#c3cfbbff' }
};

interface MyCalendarEvent extends CalendarEvent {
  servicio?: string;
  auth?: boolean;
  motivo?: string;
  meta?: any;
}
@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.css']
})
export class CronogramaComponent {

  @ViewChild('cellTemplate', { static: true }) cellTemplate!: TemplateRef<any>;
  
  
  view: CalendarView = CalendarView.Month;
  events: MyCalendarEvent[] = [];
  refresh: Subject<void> = new Subject<void>();
  viewDate: Date = new Date();
  CalendarView = CalendarView;
  holidays: Feriado[] = [];

  hoveredEvent: MyCalendarEvent | null = null;
  hoveredEventId: string | number | null | undefined = null;

  //Autenticación
  roles: string[] =[];
  isAutoridad: boolean = false;
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;
  currentRole: string | null = null;

  efectorId: number | null = null;
  efectorNombre: string | null = null;
  efectorNivel: number | null = null;

  nombreUsuario = '';
  apellidoUsuario = '';

  servicios: ServicioSummaryDto[] = [];
  selectedServiceId: number | null = null;

  exportandoPDF = false;

  constructor(
    private feriadoService: FeriadoService,
    private cronogramaService: CronogramaTentativoService,
    public dialog: MatDialog,
    private router: Router,
    private tokenService: TokenService,
    private efectorService: EfectorService,
    private hospitalService: HospitalService,
    private toastr: ToastrService,
    private authService: AuthService
) {}

  changeView(view: CalendarView): void {
    this.view = view;
  }

  parseDate(dateString: string): Date {
    const parts = dateString.split('-');
    return new Date(+parts[0], +parts[1] - 1, +parts[2]);
  }

  isEventHovered(event: MyCalendarEvent): boolean {
  return this.hoveredEventId === event.id;
  }

  ngOnInit(): void {
    // Obtener el ID efector del servicio
    this.efectorId = this.efectorService.getCurrentEfectorId();
      if (this.efectorId) {
        this.loadEfectorName();
          this.feriadoService.list().subscribe((feriados: Feriado[]) => {
          this.holidays = feriados.map(feriado => ({
            ...feriado,
            fecha: moment(feriado.fecha).toDate()
          }));
          this.refresh.next();
        });

        this.loadCronogramas();
        this.obtenerServicios(); 
      } else {
        this.toastr.warning('No seleccionaste un efector', 'Advertencia', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.router.navigateByUrl('/home-page');
    }

    // Verifica si el usuario está logueado
    this.tokenService.isLogged$.subscribe(isLogged => {
      if (isLogged) {
        // Si está logueado, obtiene nombre y apellido del usuario
        this.loadUserDetails();
      } else {
        this.nombreUsuario = '';
        this.apellidoUsuario = '';
      }
    });

    // Obtener rol actual
    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();

      if (!this.currentRole) {
        console.warn('No hay un rol seleccionado actualmente.');
      }
    });
  }

  // Roles a usar
  UserRoles(): void {
    if (this.currentRole) {
      this.isUsuario = this.currentRole === 'ROLE_USER';
      this.isAdministrativo = this.currentRole === 'ROLE_ADMIN';
      this.isAutoridad = this.currentRole === 'ROLE_AUTORIDAD';
      this.isDph = this.currentRole === 'ROLE_DPH';
      this.isSuper = this.currentRole === 'ROLE_SUPERUSER';
    } else {
      // Si no hay rol seleccionado, todos como false
      this.isAdministrativo = false;
      this.isAutoridad = false;
      this.isUsuario = false;
      this.isDph = false;
      this.isSuper = false;
    }
  }

  //trae el nombre del efector esta en sesion
  loadEfectorName(): void {
    if (this.efectorId) {
      this.efectorService.getEfectorNombre(this.efectorId).subscribe(
        (efector: EfectorSummaryDto) => {
          this.efectorNombre = efector.nombre;
        },
        (error) => {
          console.error('Error al obtener el efector:', error);
          this.efectorNombre = null;
        }
      );
    }
  }

  private loadUserDetails() {
    // Llamo al servicio para obtener los detalles del usuario
    this.authService.detailPersonBasicPanel().subscribe(
      (response: PersonBasicPanelDto) => {
        this.nombreUsuario = response.nombre;
        this.apellidoUsuario = response.apellido;
      },
      (error) => {
        console.error('Error al obtener detalles del usuario:', error);
      }
    );
  }

  obtenerServicios(): void {
    this.hospitalService.getActiveServicesByHospital(this.efectorId!).subscribe((data: ServicioSummaryDto[]) => {
      this.servicios = data;
    });
  }

  // Método para cargar los cronogramas
  loadCronogramas(): void {
    if (this.selectedServiceId) {
      // Si hay un servicio seleccionado, cargar cronogramas filtrados por servicio
      this.cronogramaService.listEfectorService(this.efectorId!, this.selectedServiceId!).subscribe((cronogramas) => {
        this.events = this.mapCronogramas(cronogramas);
        this.refresh.next();
      });
    } else {
      // Si no hay servicio seleccionado, cargar todos los cronogramas
      this.cronogramaService.listEfector(this.efectorId!).subscribe((cronogramas) => {
        this.events = this.mapCronogramas(cronogramas);
        this.refresh.next();
      });
    }
  }

  // Mapeo de los cronogramas al formato adecuado
mapCronogramas(cronogramas: any[]): any[] {
  return cronogramas.map((cronograma) => {
    const tipoGuardia = cronograma.tipoGuardia?.nombre;
    const observacion = cronograma.observacion;
    const servicio = cronograma.servicio ? cronograma.servicio.descripcion : 'Sin servicio';
    const id = cronograma.id;
    const auth = cronograma.autorizado;
    const authfor = `${cronograma.autoridad?.persona?.apellido}, ${cronograma.autoridad?.persona?.nombre}`;
    const motivo = cronograma.motivoAutorizacion;

    const fechaHoraIngreso = moment(cronograma.fechaIngreso).set({
      hour: parseInt(cronograma.horaIngreso.split(':')[0], 10),
      minute: parseInt(cronograma.horaIngreso.split(':')[1], 10),
      second: 0
    });

    const fechaHoraEgreso = moment(cronograma.fechaEgreso).set({
      hour: parseInt(cronograma.horaEgreso.split(':')[0], 10),
      minute: parseInt(cronograma.horaEgreso.split(':')[1], 10),
      second: 0
    });

    const color = colorMapping[tipoGuardia as TipoGuardia] || { primary: '#cccccc', secondary: '#e0e0e0' };

    const result = {
      start: fechaHoraIngreso.toDate(),
      end: fechaHoraEgreso.toDate(),
      title: `${cronograma.asistencial?.apellido}, ${cronograma.asistencial?.nombre} - ${tipoGuardia}`,
      servicio: servicio,
      obs: observacion,
      auth: auth,
      authfor: authfor,
      motivo: motivo,
      id: id,
      color: color,
      meta: cronograma
    };

    console.log('📝 Cronograma procesado:', {
      id: id,
      tipoGuardia,
      servicio,
      observacion,
      auth,
      authfor,
      motivo,
      fechaHoraIngreso: fechaHoraIngreso.toISOString(),
      fechaHoraEgreso: fechaHoraEgreso.toISOString(),
      title: result.title,
      color
    });

    return result;
  });
}
  
  // Método que se llama cuando se selecciona un servicio del menú
  onServicioSelect(serviceId: number | null): void {
    this.selectedServiceId = serviceId;
    this.loadCronogramas(); // Vuelve a cargar los cronogramas con el filtro del servicio
  }

  getServicioNombreSeleccionado(): string {
    if (!this.selectedServiceId) {
      return 'Todos los servicios';
    }
    const selected = this.servicios.find(s => s.id === this.selectedServiceId);
    return selected ? `Servicio: ${selected.descripcion}` : 'Seleccionar servicio';
  }
  
  getHolidays(): void {
    this.feriadoService.list().subscribe((feriados: Feriado[]) => {
      this.holidays = feriados;
    });
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      const holiday = this.holidays.find(holiday => this.isSameDay(day.date, holiday.fecha));
      if (holiday) {
        day.cssClass = 'holiday-class';
      }
    });
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent): void {
    renderEvent.hourColumns.forEach(column => {
      column.hours.forEach(hour => {
        hour.segments.forEach(segment => {
          const holiday = this.holidays.find(holiday => this.isSameDay(segment.date, holiday.fecha));
          if (holiday) {
            segment.cssClass = 'holiday-class';
          }
        });
      });
    });
  }

  /*beforeDayViewRender(renderEvent: CalendarDayViewBeforeRenderEvent): void {
    renderEvent.hourColumns.forEach(column => {
      column.hours.forEach(hour => {
        hour.segments.forEach(segment => {
          // Asegúrate de que segment.date es un objeto Date
          const holiday = this.holidays.find(holiday => this.isSameDay(segment.date, holiday.fecha));
          if (holiday) {
            segment.cssClass = 'holiday-class';
          }
        });
      });
    });
  }*/
  
  isHoliday(date: Date): boolean {
    return this.holidays.some(holiday => this.isSameDay(date, holiday.fecha));
  }

  getHolidayName(date: Date): string | null {
    // Usamos Moment.js para comparar las fechas
    const holiday = this.holidays.find(holiday => moment(holiday.fecha).isSame(moment(date), 'day'));
    return holiday ? holiday.motivo : null;
  }
  
  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

dayClicked(day: MonthViewDay<any>): void {
  const dayStart = moment(day.date).startOf('day').toDate();

  const events = this.events.filter(event => {
    const eventStart = moment(event.start).startOf('day').toDate();
    const eventEnd = moment(event.end).startOf('day').toDate();
    return dayStart >= eventStart && dayStart <= eventEnd;
  });

  const holidayName = this.getHolidayName(day.date);

  const dialogRef = this.dialog.open(CronogramaDetailComponent, {
    width: '600px',
    data: {
      title:'Lista profesionales',
      events: events.map(event => ({
        ...event,
        color: event.color
      })),
      holidayName: holidayName
    }
  });

  dialogRef.componentInstance.eventDeleted.subscribe(() => {
    this.loadCronogramas();
  });
}
  
  onEventClicked({ event }: { event: any }): void {
    const dialogRef = this.dialog.open(CronogramaDetailComponent, {
      width: '600px',
      data: {
        title:'Detalle evento',
        events: [event],  // Solo ese evento
        holidayName: this.getHolidayName(event.start)
      }
    });
  
    dialogRef.componentInstance.eventDeleted.subscribe(() => {
      this.loadCronogramas();  // Refrescar eventos si se eliminó
    });
  }

// En tu componente TypeScript, añade este método:
getApellidoFromEvent(event: MyCalendarEvent): string {
  // Extrae el apellido del título (formato: "Apellido, Nombre - TipoGuardia")
  if (event.title && event.title.includes(',')) {
    return event.title.split(',')[0].trim();
  }
  
  // Si no tiene el formato esperado, intenta extraer de otra manera
  if (event.meta?.asistencial?.apellido) {
    return event.meta.asistencial.apellido;
  }
  
  // Fallback: primera palabra del título
  return event.title ? event.title.split(' ')[0] : 'Evento';
}

// Método para manejar clics en eventos de la vista mensual
onMonthEventClicked(event: MyCalendarEvent): void {
  const dialogRef = this.dialog.open(CronogramaDetailComponent, {
    width: '600px',
    data: {
      title: 'Detalle evento',
      events: [event],
      holidayName: this.getHolidayName(event.start)
    }
  });

  dialogRef.componentInstance.eventDeleted.subscribe(() => {
    this.loadCronogramas();
  });
}   

  // Método para manejar el hover sobre eventos
  onEventMouseEnter(event: MyCalendarEvent): void {
    this.hoveredEvent = event;
    this.hoveredEventId = event.id;
    this.refresh.next(); // Forzar actualización para aplicar las clases
  }

  onEventMouseLeave(event: MyCalendarEvent): void {
    this.hoveredEvent = null;
    this.hoveredEventId = null;
    this.refresh.next(); // Forzar actualización para remover las clases
  }

  // Método para verificar si un día contiene el evento hovereado
  isDayHovered(day: any): boolean {
    if (!this.hoveredEventId) return false;
    
    const dayStart = moment(day.date).startOf('day').toDate();
    const eventStart = moment(this.hoveredEvent!.start).startOf('day').toDate();
    const eventEnd = moment(this.hoveredEvent!.end).startOf('day').toDate();
    
    return dayStart >= eventStart && dayStart <= eventEnd;
  }

  // Método para obtener la clase CSS del evento hovereado
  getHoveredEventClass(event: MyCalendarEvent): string {
    if (this.hoveredEventId === event.id) {
      return 'event-hovered';
    }
    return '';
  }

/*EventDialog(): void {
  const dialogRef = this.dialog.open(PruebaFormComponent, {
    width: '600px',
});

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.addEvent(new Date(result.startDate), new Date(result.endDate), result.title, result.color);
    }
  });
}*/

  nextView(): void {
    if (this.view === CalendarView.Month) {
      const nextMonth = new Date(this.viewDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      this.viewDate = nextMonth;
    } else if (this.view === CalendarView.Week) {
      const nextWeek = new Date(this.viewDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      this.viewDate = nextWeek;
    }
  }
  
  previousView(): void {
    if (this.view === CalendarView.Month) {
      const previousMonth = new Date(this.viewDate);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      this.viewDate = previousMonth;
    } else if (this.view === CalendarView.Week) {
      const previousWeek = new Date(this.viewDate);
      previousWeek.setDate(previousWeek.getDate() - 7);
      this.viewDate = previousWeek;
    }
  }

  currentView(): void {
    this.viewDate = new Date();
  }

  /*addEvent(startDate: Date, endDate: Date, eventTitle: string, color: any): void {
    this.events = [
      ...this.events,
      {
        start: startDate,
        end: endDate,
        title: eventTitle,
        color: {
          primary: color.primary,
          secondary: color.secondary
        }
      }
    ];
  }*/

    openCronogramaDialog(): void {
      const dialogRef = this.dialog.open(CronogramaCreateComponent, {
        width: '600px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadCronogramas();
        }
      });
    }

  async exportarCalendarioPDF(): Promise<void> {
    if (this.exportandoPDF) return;

    this.exportandoPDF = true;

    try {
      this.toastr.info('Generando PDF...', '', { timeOut: 3000 });

      const calendarioElement = document.querySelector('mwl-calendar-month-view');
      const referenciasElement = document.querySelector('.row.d-float.justify-content-center');
      
      if (!calendarioElement) {
        throw new Error('No se encontró el calendario');
      }

      // Capturar en paralelo para mayor velocidad
      const [canvasCalendario, canvasReferencias] = await Promise.all([
        html2canvas(calendarioElement as HTMLElement, {
          scale: 4, useCORS: true, backgroundColor: '#ffffff', logging: false
        }),
        referenciasElement ? html2canvas(referenciasElement as HTMLElement, {
          scale: 4, useCORS: true, backgroundColor: '#ffffff', logging: false
        }) : Promise.resolve(null)
      ]);

      const monthName = this.viewDate.toLocaleString('es-ES', { month: 'long' });
      const year = this.viewDate.getFullYear();

      const documentDefinition: any = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [20, 20, 20, 20],
        content: [
          // Título principal
          {
            text: `Cronograma Tentativo - ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`,
            fontSize: 16,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 10]
          },
          {
            columns: [
              { 
                text: `Efector: ${this.efectorNombre || 'No especificado'}`,
                fontSize: 11,
                color: '#555555',
                width: '60%'
              },
              { 
                text: `Fecha exportación: ${new Date().toLocaleDateString('es-ES')}`,
                fontSize: 11,
                color: '#555555',
                alignment: 'right',
                width: '40%'
              }
            ],
            margin: [0, 0, 0, 15]
          },

          // Referencias (si existen)
          ...(canvasReferencias ? [{
            image: canvasReferencias.toDataURL('image/png'),
            width: 550,
            alignment: 'center',
            margin: [0, 0, 0, 18]
          }] : []),

          // Imagen del calendario
          {
            image: canvasCalendario.toDataURL('image/png'),
            width: 750,
            alignment: 'center',
            margin: [0, 0, 0, 25]
          },

          // 👇 Pie con el nombre del usuario
          {
            text: `Usuario: ${this.nombreUsuario} ${this.apellidoUsuario}`,
            fontSize: 9,
            color: '#666666',
            alignment: 'right',
            margin: [0, 10, 5, 0] // margen superior más amplio para separarlo visualmente
          }
        ]
      };

      pdfMake.createPdf(documentDefinition).download(`cronograma_tentativo_${monthName}_${year}.pdf`);
      
      this.toastr.success('PDF generado exitosamente', 'Éxito', { timeOut: 3000 });

    } catch (error) {
      console.error('Error al generar PDF:', error);
      this.toastr.error('Error al generar el PDF: ' + (error as Error).message, 'Error', { timeOut: 5000 });
    } finally {
      this.exportandoPDF = false;
    }
  }
}