import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PopupCalendarioComponent } from '../popup-calendario/popup-calendario.component';


@Component({
  selector: 'app-ddjj-cargoyagrup',
  templateUrl: './ddjj-cargoyagrup.component.html',
  styleUrls: ['./ddjj-cargoyagrup.component.css']
})
export class DdjjCargoyagrupComponent {
  /* date = '2023-07-21T13:59:31.238Z';  */

  profesional: any[] = [];
  today:number = new Date(2023,7,0).getDate();//31
  numberOfMonth: Array<number> = new Array<number>();

  daysOfMonth: Array<Date> = new Array<Date>();

  constructor(
    public dialogReg: MatDialog,
    private route: ActivatedRoute,
  ){
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

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['vector']) {
        this.profesional = JSON.parse(params['vector']);
        console.log(this.profesional);
      }
    });
  }





  openPopupCalendario(){
    this.dialogReg.open(PopupCalendarioComponent, {
      width: '600px',
      disableClose: true,
    })
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
