import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-professional-detail',
  templateUrl: './professional-detail.component.html',
  styleUrls: ['./professional-detail.component.css'],
})
export class ProfessionalDetailComponent implements OnInit {
  id: string | null | undefined;
  persona: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('ID:', this.id);
    this.cargarDatosPersona(parseInt(this.id ?? '', 10));
  }

  cargarDatosPersona(id: number) {
    this.http
      .get<any[]>('../../../assets/jsonFiles/profesionales.json')
      .subscribe((data: any[]) => {
        this.persona = data.find((item) => item.id === id);
        if (this.persona) {
          console.log(this.persona);
        }
      });
  }
}
