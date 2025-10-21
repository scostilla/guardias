import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cronograma-p',
  templateUrl: './cronograma-p.component.html',
  styleUrls: ['./cronograma-p.component.css']
})
export class CronogramaPComponent {

  constructor(
    public dialogReg: MatDialog,
  ){}



}
