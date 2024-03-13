import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-prueba-form',
  templateUrl: './prueba-form.component.html',
  styles: []
})

export class PruebaFormComponent {
  eventTitle!: string;
  eventStartDate!: Date; 
  eventStartTime!: string; 
  eventEndDate!: Date; 
  eventEndTime!: string; 
  eventColor!: string; 
  predefinedColors = [
    { name: 'Extra', primary: '#fcc932', secondary: '#fcc932' },
    { name: 'Cargo', primary: '#91A8DA', secondary: '#91A8DA' },
    { name: 'Agrupación', primary: '#F4AF88', secondary: '#F4AF88' },
    { name: 'Contrafactura', primary: '#A9D08F', secondary: '#A9D08F' }
  ];

  constructor(public dialogRef: MatDialogRef<PruebaFormComponent>) {}

  onSubmit(): void {
    const selectedColor = this.predefinedColors.find(color => color.name === this.eventColor);

  // Asumiendo que eventStartTime y eventEndTime están en formato 'HH:mm'
  const startDateTime = new Date(this.eventStartDate);
  const startTimeParts = this.eventStartTime.split(':');
  startDateTime.setHours(parseInt(startTimeParts[0]), parseInt(startTimeParts[1]));

  const endDateTime = new Date(this.eventEndDate);
  const endTimeParts = this.eventEndTime.split(':');
  endDateTime.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]));

  console.log({
    title: this.eventTitle,
    startDate: startDateTime,
    endDate: endDateTime,
    color: selectedColor 
  });

  // Cerrar el diálogo y enviar los datos sin convertir a UTC
  this.dialogRef.close({
    title: this.eventTitle,
    startDate: startDateTime.toString(), // Usar toString() para mantener la zona horaria local
    endDate: endDateTime.toString(),     // Usar toString() para mantener la zona horaria local
    color: selectedColor 
  });}
}