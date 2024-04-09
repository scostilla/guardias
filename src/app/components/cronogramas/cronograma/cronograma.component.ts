import { Component, OnInit } from '@angular/core';
import { CalendarMonthViewDay, CalendarView, CalendarWeekViewBeforeRenderEvent } from 'angular-calendar';
import { MonthViewDay } from 'calendar-utils';
import { MatDialog } from '@angular/material/dialog';
import { PruebaFormComponent } from '../../configuracion/territorio/prueba-form/prueba-form.component';
import { CronogramaDetailComponent } from '../cronograma-detail/cronograma-detail.component';
import { Feriado } from 'src/app/models/Configuracion/Feriado'; 
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service'; 


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

  constructor(private feriadoService: FeriadoService, public dialog: MatDialog) {}

  changeView(view: CalendarView): void {
    this.view = view;
  }

  parseDate(dateString: string): Date {
    const parts = dateString.split('-');
    return new Date(+parts[0], +parts[1] - 1, +parts[2]);
  }

  ngOnInit(): void {
    this.feriadoService.list().subscribe((feriados: Feriado[]) => {
      this.holidays = feriados.map(feriado => ({
        ...feriado,
        fecha: this.parseDate(feriado.fecha as unknown as string)
      }));
      this.refreshView();
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