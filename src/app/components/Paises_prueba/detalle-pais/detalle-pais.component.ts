import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaisesService } from 'src/app/services/paises.service';
import { ToastrService } from 'ngx-toastr';
import { Paises } from 'src/app/models/paises';

@Component({
  selector: 'app-detalle-pais',
  templateUrl: './detalle-pais.component.html',
  styleUrls: ['./detalle-pais.component.css']
})
export class DetallePaisComponent implements OnInit {

  paises?: Paises;

  constructor(
    private paisService: PaisesService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.paisService.detail(id).subscribe(
      data=> {
        this.paises = data;
      },
      err => {
        alert("No se pudo modificar2 el pais.");
        this.router.navigate(['/']);
        this.volver();
      }
    );

  }

  volver(): void {
    this.router.navigate(['/lista-pais'])
  }
}
