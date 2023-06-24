import { Component } from '@angular/core';

@Component({
  selector: 'app-novedades-form',
  templateUrl: './novedades-form.component.html',
  styleUrls: ['./novedades-form.component.css']
})
export class NovedadesFormComponent {
  selectedService:string='Compensatorio';
  selectedGuard: string = '';
  disableButton: boolean = this.selectedGuard == '';

}
