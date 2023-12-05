import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaisService } from 'src/app/services/pais.service';
import { ToastrService } from 'ngx-toastr';
import { Pais } from 'src/app/models/pais';

@Component({
  selector: 'app-provincia-detail',
  templateUrl: './provincia-detail.component.html',
  styleUrls: ['./provincia-detail.component.css']
})

export class ProvinciaDetailComponent implements OnInit {

  pais?: Pais;

  constructor(
    private paisService: PaisService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.paisService.detail(id).subscribe(
      data=> {
        this.pais = data;
      },
      err => {
        alert("No se pudo modificar2 el pais.");
        this.router.navigate(['/provincia']);
      }
    );

  }

}
