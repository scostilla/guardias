import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import ConsultaProfesional from 'src/server/models/ConsultaProfesional';

@Component({
  selector: 'app-professional-dh',
  templateUrl: './professional-dh.component.html',
  styleUrls: ['./professional-dh.component.css']
})
export class ProfessionalDhComponent implements OnInit {
  id: string | null | undefined;
  person: any;
  profesionales?: ConsultaProfesional[] | undefined;

  constructor(private route: ActivatedRoute, private http: HttpClient, private apiServiceService: ApiServiceService) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('ID:', this.id);
    this.cargarDatosPerson(parseInt(this.id ?? '', 10));
  }

  cargarDatosPerson(id: number) {
    this.apiServiceService.getProfesionales().subscribe((data) => {
      this.profesionales = data;
      this.person = this.profesionales.find((item) => item.idProfesional === id);
      if (this.person) {
        console.log(this.person);
      }
    });
  }
}
