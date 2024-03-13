import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-prueba-form2',
  templateUrl: './prueba-form2.component.html',
  styles: []
})

export class PruebaForm2Component {
  eventTitle!: string;
  holliday: boolean = true;
  hollidayDate!: Date;
  eventColor!: string; 
  predefinedColors = [
    { name: 'Inamovible', primary: '#ff7676', secondary: '#ff7676' },
    { name: 'Trasladable', primary: '#ff7676', secondary: '#ff7676' },
    { name: 'No laboral', primary: '#ff7676', secondary: '#ff7676' },
    { name: 'Turístico', primary: '#ff7676', secondary: '#ff7676' }
  ];
  currentDate:Date = new Date();


  constructor(public dialogRef: MatDialogRef<PruebaForm2Component>) {}

  onSubmit(): void {
    let fechaLocal = this.hollidayDate.toLocaleDateString('es-AR', {
      timeZone: 'America/Argentina/Jujuy'
    });

    const selectedColor = this.predefinedColors.find(color => color.name === this.eventColor);
    this.dialogRef.close({
      title: this.eventTitle,
      allDay: this.holliday,
      startDate: this.hollidayDate,
      endDate: this.hollidayDate,
      color: selectedColor 
    });
  }
}