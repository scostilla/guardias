import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-revista-detail',
  templateUrl: './revista-detail.component.html',
  styleUrls: ['./revista-detail.component.css']
})
export class RevistaDetailComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log('Legajo ID:', this.data.legajoId);
  }

}