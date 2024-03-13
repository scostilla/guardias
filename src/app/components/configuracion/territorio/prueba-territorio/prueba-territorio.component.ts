import { Component, OnInit } from '@angular/core';
import { CalendarMonthViewDay, CalendarView, CalendarWeekViewBeforeRenderEvent } from 'angular-calendar';
import { MonthViewDay } from 'calendar-utils';
import { MatDialog } from '@angular/material/dialog';
import { PruebaFormComponent } from '../prueba-form/prueba-form.component';
import { PruebaForm2Component } from '../prueba-form2/prueba-form2.component';
import { PruebaDetailComponent } from '../prueba-detail/prueba-detail.component';

interface Holiday {
  date: Date;
  name: string;
}

@Component({
  selector: 'app-prueba-territorio',
  templateUrl: './prueba-territorio.component.html',
  styleUrls: ['./prueba-territorio.component.css']
})

export class PruebaTerritorioComponent {
  
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: any[] = [];
  CalendarView = CalendarView;
  holidays: Holiday[] = [];

  constructor(public dialog: MatDialog) {}

  changeView(view: CalendarView): void {
    this.view = view;
  }

  ngOnInit(): void {
    this.getHolidays();
  }

  getHolidays(): void {
    this.holidays = [
      { date: new Date(2024, 2, 28), name: 'Jueves Santo' },
      { date: new Date(2024, 2, 29), name: 'Viernes Santo' },
    ];
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      if (this.isHoliday(day.date)) {
        day.cssClass = 'holiday-class';
      }
    });
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent): void {
    renderEvent.hourColumns.forEach(column => {
      column.hours.forEach(hour => {
        hour.segments.forEach(segment => {
          if (this.isHoliday(segment.date)) {
            segment.cssClass = 'holiday-class';
          }
        });
      });
    });
  }

  isHoliday(date: Date): boolean {
    return this.holidays.some(holiday => this.isSameDay(date, holiday.date));
  }

  getHolidayName(date: Date): string | null {
    const holiday = this.holidays.find(holiday => this.isSameDay(date, holiday.date));
    return holiday ? holiday.name : null;
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
  
    const dialogRef = this.dialog.open(PruebaDetailComponent, {
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