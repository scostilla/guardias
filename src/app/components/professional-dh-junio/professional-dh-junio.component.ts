import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-professional-dh-junio',
  templateUrl: './professional-dh-junio.component.html',
  styleUrls: ['./professional-dh-junio.component.css']
})
export class ProfessionalDhJunioComponent {
  id: string | null | undefined;
  person: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('ID:', this.id);
    this.cargarDatosperson(parseInt(this.id ?? '', 10));
  }

  cargarDatosperson(id: number) {
    this.http
      .get<any[]>('../../../assets/jsonFiles/profesionales.json')
      .subscribe((data: any[]) => {
        this.person = data.find((item) => item.id === id);
        if (this.person) {
          console.log(this.person);
        }
      });
  }

}
