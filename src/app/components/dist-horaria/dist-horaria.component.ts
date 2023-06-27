import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dist-horaria',
  templateUrl: './dist-horaria.component.html',
  styleUrls: ['./dist-horaria.component.css'],
})
export class DistHorariaComponent {
  selectedService: string = 'Cargo';
  selectedGuard: string = '';
  disableButton: boolean = this.selectedGuard == '';
  constructor(private http: HttpClient) {}
  options: any[] | undefined;

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.options = data;
      });
  }
}
