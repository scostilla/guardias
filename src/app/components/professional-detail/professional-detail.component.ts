import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-professional-detail',
  templateUrl: './professional-detail.component.html',
  styleUrls: ['./professional-detail.component.css'],
})
export class ProfessionalDetailComponent implements OnInit {
  id: string | null | undefined;
  person: any;

  constructor(private route: ActivatedRoute, private http: HttpClient,
    private apiServiceService: ApiServiceService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('ID:', this.id);
    this.cargarDatosperson(parseInt(this.id ?? '', 10));
  }

    cargarDatosperson(id: number) {
      this.apiServiceService.getProfesionales().subscribe((DBdata: any[]) => {
        console.log(DBdata);
        this.person = DBdata.find(
          (item) => item.idProfesional === this.data.id
        );
      }
    )}
}
