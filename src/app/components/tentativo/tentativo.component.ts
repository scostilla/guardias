import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tentativo',
  templateUrl: './tentativo.component.html',
  styleUrls: ['./tentativo.component.css']
})
export class TentativoComponent {
  today:number = new Date(2023,7,0).getDate();//31
  numberOfMonth: Array<number> = new Array<number>();
  
  daysOfMonth: Array<Date> = new Array<Date>(); 
  
  constructor(){
    for (var dia = 1; dia <= this.today; dia++) {
      this.numberOfMonth.push(dia);
    }

    for (var di = 1; di <= this.numberOfMonth.length; di++) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const especificDate = new Date (year,month,di)
      this.daysOfMonth.push(especificDate);
      
    }
  }
}