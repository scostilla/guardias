import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaisesService } from 'src/app/services/paises.service';
import { Paises } from '../../../models/paises';

@Component({
  selector: 'app-editar-pais',
  templateUrl: './editar-pais.component.html',
  styleUrls: ['./editar-pais.component.css']
})
export class EditarPaisComponent implements OnInit {

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
        alert("No se pudo agregart el pais.");
        this.router.navigate(['/']);
      }
    );
  }

  onUpdate(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.paisService.update(id, this.paises).subscribe(
      data=> {
        alert("Pais modificado con exito.");
        this.router.navigate(['/']);
      },
      err => {
        alert("No se pudo modificar el pais.");
        this.router.navigate(['/']);
      }
    )
  }

  }

