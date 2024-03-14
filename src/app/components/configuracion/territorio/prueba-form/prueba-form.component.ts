import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-prueba-form',
  templateUrl: './prueba-form.component.html',
  styles: []
})

export class PruebaFormComponent implements OnInit {
  form?: FormGroup;
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

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<PruebaFormComponent>) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      eventTitle: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{4,50}$')]],
      eventStartDate: ['', Validators.required],
      eventStartTime: ['', Validators.required],
      eventEndDate: ['', Validators.required],
      eventEndTime: ['', Validators.required],
      eventColor: ['', Validators.required]
    }, { validator: this.dateAndTimeValidator.bind(this) });
  this.form.get('eventEndDate')?.valueChanges.subscribe(() => {
    this.form?.get('eventEndTime')?.updateValueAndValidity();
  });
  }

  dateAndTimeValidator(group: FormGroup): any {
    const startDateControl = group.get('eventStartDate');
    const endDateControl = group.get('eventEndDate');
    const startTimeControl = group.get('eventStartTime');
    const endTimeControl = group.get('eventEndTime');
  
    if (startDateControl && endDateControl && startTimeControl && endTimeControl) {
      const start = new Date(startDateControl.value);
      const end = new Date(endDateControl.value);
      const startTime = startTimeControl.value ? startTimeControl.value.split(':') : null;
      const endTime = endTimeControl.value ? endTimeControl.value.split(':') : null;
  
      if (startTime && endTime) {
        start.setHours(parseInt(startTime[0]), parseInt(startTime[1]));
        end.setHours(parseInt(endTime[0]), parseInt(endTime[1]));
      }
  
      if (start.toDateString() === end.toDateString()) {
        if (end.getTime() < start.getTime()) {
          group.controls['eventEndTime'].setErrors({ timeInvalid: true });
        }
      } else {
        if (end < start) {
          group.controls['eventEndDate'].setErrors({ dateInvalid: true });
          group.controls['eventEndTime'].setErrors({ timeInvalid: true });
        }
      }
    }
  
    return null;
  }

  onSubmit(): void {
    if (this.form?.valid) {
      const formValue = this.form.value;
      const selectedColor = this.predefinedColors.find(color => color.name === formValue.eventColor);
  
      const startDateTime = new Date(formValue.eventStartDate);
      const startTimeParts = formValue.eventStartTime.split(':');
      startDateTime.setHours(parseInt(startTimeParts[0]), parseInt(startTimeParts[1]));
  
      const endDateTime = new Date(formValue.eventEndDate);
      const endTimeParts = formValue.eventEndTime.split(':');
      endDateTime.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]));
    
      this.dialogRef.close({
        title: formValue.eventTitle,
        startDate: startDateTime.toString(),
        endDate: endDateTime.toString(),
        color: selectedColor 
      });
    }
  }
}