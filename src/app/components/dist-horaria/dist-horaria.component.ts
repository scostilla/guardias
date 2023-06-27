import { Component } from '@angular/core';

@Component({
  selector: 'app-dist-horaria',
  templateUrl: './dist-horaria.component.html',
  styleUrls: ['./dist-horaria.component.css']
})
export class DistHorariaComponent {
  selectedService:string='Cargo';
  selectedGuard: string = '';
  disableButton: boolean = this.selectedGuard == '';
  
  
}
