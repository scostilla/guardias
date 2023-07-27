import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ddjj-cargoyagrup',
  templateUrl: './ddjj-cargoyagrup.component.html', 
  styleUrls: ['./ddjj-cargoyagrup.component.css']
})
export class DdjjCargoyagrupComponent {
  /* date = '2023-07-21T13:59:31.238Z';  */
  
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
 
  /* today:number = new Date(2023,9,0).getDate();
  dia:number = new Date().getDay();
  numberOfMonth: Array<number> = new Array<number>();
  daysOfMonth: Array<string> = new Array<string>(); */
/*   constructor(){
    for(let i=1;i<= this.today; i++)
    {
      this.numberOfMonth.push(i)
    } */
/* 
    for(let i=1;i<= this.today; i++)
    {
      this.numberOfMonth.push(i)
    } */
}
