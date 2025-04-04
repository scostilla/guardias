import { Component, OnInit } from '@angular/core';
import { CalendarMonthViewDay, CalendarView, CalendarWeekViewBeforeRenderEvent, CalendarDayViewBeforeRenderEvent } from 'angular-calendar';
import { MonthViewDay } from 'calendar-utils';
import { MatDialog } from '@angular/material/dialog';
import { CronogramaCreateComponent } from '../cronograma-create/cronograma-create.component';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { CronogramaDetailComponent } from '../cronograma-detail/cronograma-detail.component';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Feriado } from 'src/app/models/Configuracion/Feriado'; 
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

//Autenticación
import { TokenService } from 'src/app/services/login/token.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';

enum TipoGuardia {
  CARGO = 'CARGO',
  AGRUPACION = 'AGRUPACION',
  EXTRA = 'EXTRA',
  CONTRAFACTURA = 'CONTRAFACTURA'
}

// Mapeo de los colores según el tipo de guardia
const colorMapping: Record<TipoGuardia, { primary: string, secondary: string }> = {
  [TipoGuardia.CARGO]: { primary: '#91A8DA', secondary: '#B6C6E6' },
  [TipoGuardia.AGRUPACION]: { primary: '#eb7430', secondary: '#F0B59E' },
  [TipoGuardia.EXTRA]: { primary: '#fcc932', secondary: '#F9D784' },
  [TipoGuardia.CONTRAFACTURA]: { primary: '#A9D08F', secondary: '#B8E0A6' }
};

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.css']
})
export class CronogramaComponent {
  
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: any[] = [];
  CalendarView = CalendarView;
  holidays: Feriado[] = [];

  //Autenticación
  isLogged = false;
  roles: string[] =[];
  isAutoridad: boolean = false;
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;
  userId: number | null = null;
  nombreUsuario: string = '';
  apellidoUsuario: string = '';
  nombresEfectores: EfectorSummaryDto[] = [];
  usuarioPersona: number | null = null;
  currentRole: string | null = null;

  efectorId: number | null = null;
  efectorNombre: string | null = null;
  showMessage: boolean = false;

  constructor(
    private feriadoService: FeriadoService,
    private cronogramaService: CronogramaTentativoService,
    public dialog: MatDialog,
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService,
    private efectorService: EfectorService,
    private hospitalService: HospitalService,
    private toastr: ToastrService,
) {}

  changeView(view: CalendarView): void {
    this.view = view;
  }

  parseDate(dateString: string): Date {
    const parts = dateString.split('-');
    return new Date(+parts[0], +parts[1] - 1, +parts[2]);
  }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.roles = this.tokenService.getAuthorities();
  
    // BehaviorSubject para obtener el rol seleccionado
    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();  // Llamar a la función que determina los roles
     
      // Si currentRole es false (null o vacío), redirige al login
      if (!this.currentRole) {
        this.router.navigateByUrl('');
      }
    });  
    
      const userIdFromToken = this.tokenService.getUserIdFromToken();
      this.userId = userIdFromToken !== null ? Number(userIdFromToken) : null;
      console.log('ID del usuario logeado:',this.userId);
  
      // Obtener detalles del usuario
      this.authService.detailPersonBasicPanel().subscribe(
        (response: PersonBasicPanelDto) => {
          this.usuarioPersona = response.id;
          this.nombreUsuario = response.nombre;
          this.apellidoUsuario = response.apellido;
  
          // Log para mostrar el usuario
          console.log('Usuario logueado:', this.nombreUsuario, this.apellidoUsuario, this.usuarioPersona);
        },
        error => {
          console.error('Error al obtener detalles del usuario:', error);
        }
      );
    } else {
      this.isLogged = false;
      console.log('El usuario no está logueado.');
      this.router.navigateByUrl('');
    }

    // Obtener el ID efector del servicio
    this.efectorId = this.efectorService.getCurrentEfectorId();
    this.loadEfectorName();
    
  // Verificar si el ID efector es válido
  if (this.efectorId === null) {
    this.showMessage = true;
    this.toastr.warning('No seleccionaste un efector', 'Advertencia', {
      timeOut: 5000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigateByUrl('/home-page');
  } else {
  // Cargar los feriados
  this.feriadoService.list().subscribe((feriados: Feriado[]) => {
    this.holidays = feriados.map(feriado => ({
      ...feriado,
      fecha: moment(feriado.fecha).toDate()
    }));
    this.refreshView();
  });

  this.loadCronogramas();
    }
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
      this.isUsuario = false;
      this.isDph = false;
      this.isSuper = false;
    }
  }

  //trae el nombre del efector esta en sesion que filtra lo mostrado
  loadEfectorName(): void {
    if (this.efectorId) {
      this.hospitalService.getById(this.efectorId).subscribe(
        (efector: Efector) => {
          // traigo nombre del efector
          this.efectorNombre = efector.nombre;
        },
        (error) => {
          console.error('Error al obtener el efector:', error);
          this.efectorNombre = null;
        }
      );
    }
  }

  // Método separado que carga los cronogramas
  loadCronogramas(): void {
    this.cronogramaService.listEfector(this.efectorId!).subscribe((cronogramas) => {
      this.events = cronogramas.map((cronograma) => {
        const tipoGuardia = cronograma.tipoGuardia?.nombre;
        const observacion = cronograma.observacion;
        const id = cronograma.id;

        const fechaHoraIngreso = moment(cronograma.fechaIngreso)
          .set({
            hour: parseInt(cronograma.horaIngreso.split(':')[0], 10),
            minute: parseInt(cronograma.horaIngreso.split(':')[1], 10),
            second: 0
          });

        const fechaHoraEgreso = moment(cronograma.fechaEgreso)
          .set({
            hour: parseInt(cronograma.horaEgreso.split(':')[0], 10),
            minute: parseInt(cronograma.horaEgreso.split(':')[1], 10),
            second: 0
          });

        const color = (Object.values(TipoGuardia).includes(tipoGuardia as TipoGuardia))
          ? colorMapping[tipoGuardia as TipoGuardia]
          : { primary: '#cccccc', secondary: '#e0e0e0' };

        return {
          start: fechaHoraIngreso.toDate(),
          end: fechaHoraEgreso.toDate(),
          title: `${cronograma.asistencial!.apellido}, ${cronograma.asistencial!.nombre} - ${tipoGuardia}`,
          obs: observacion,
          id: id,
          color: color,
          meta: cronograma
        };
      });
      this.refreshView(); // Refresca la vista del calendario
    });
  }
  
  refreshView(): void {
    this.viewDate = new Date(this.viewDate.getTime());
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
        events: events.map(event => ({
          ...event,
          color: event.color
        })),
        holidayName: holidayName
      }
    });
  
    // Nos suscribimos al evento emitido desde el diálogo
    dialogRef.componentInstance.eventDeleted.subscribe(() => {
      this.loadCronogramas();  // Refrescamos los cronogramas cuando un evento ha sido eliminado
    });
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
}