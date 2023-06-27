import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-novedades-form',
  templateUrl: './novedades-form.component.html',
  styleUrls: ['./novedades-form.component.css'],
})
export class NovedadesFormComponent {
  selectedService: string = 'Compensatorio';
  selectedGuard: string = '';
  disableButton: boolean = this.selectedGuard == '';
  options: any[] | undefined;

  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.options = data;
      });
  }
}
