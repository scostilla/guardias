import { Component, OnInit } from '@angular/core';
import { CalendarMonthViewDay, CalendarView, CalendarWeekViewBeforeRenderEvent } from 'angular-calendar';
import { MonthViewDay } from 'calendar-utils';
import { MatDialog } from '@angular/material/dialog';
import { PruebaFormComponent } from '../../configuracion/territorio/prueba-form/prueba-form.component';
import { CronogramaDetailComponent } from '../cronograma-detail/cronograma-detail.component';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { Feriado } from 'src/app/models/Configuracion/Feriado'; 
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

//Autenticación
import { TokenService } from 'src/app/services/login/token.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';

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

  private efectorIdSubscription!: Subscription;

  constructor(
    private feriadoService: FeriadoService,
    public dialog: MatDialog,
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService,
    private efectorService: EfectorService,
    private hospitalService: HospitalService,
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
    } else {
      //this.listAsistencial(this.efectorId);
    }
    
    this.feriadoService.list().subscribe((feriados: Feriado[]) => {
      this.holidays = feriados.map(feriado => ({
        ...feriado,
        fecha: this.parseDate(feriado.fecha as unknown as string)
      }));
      this.refreshView();
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

  isHoliday(date: Date): boolean {
    return this.holidays.some(holiday => this.isSameDay(date, holiday.fecha));
  }

  getHolidayName(date: Date): string | null {
    const holiday = this.holidays.find(holiday => this.isSameDay(date, holiday.fecha));
    return holiday ? holiday.motivo : null;
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  dayClicked(day: MonthViewDay<any>): void {
    const dayStart = new Date(day.date).setHours(0, 0, 0, 0);
    const events = this.events.filter(event => {
      const eventStart = new Date(event.start).setHours(0, 0, 0, 0);
      const eventEnd = new Date(event.end).setHours(0, 0, 0, 0);
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
  }

EventDialog(): void {
  const dialogRef = this.dialog.open(PruebaFormComponent, {
    width: '600px',
});

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.addEvent(new Date(result.startDate), new Date(result.endDate), result.title, result.color);
    }
  });
}

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

  addEvent(startDate: Date, endDate: Date, eventTitle: string, color: any): void {
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
  }


}