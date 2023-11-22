import { Component, OnInit } from '@angular/core';
import { Paises } from '../../../models/paises';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaisesService } from 'src/app/services/paises.service';

@Component({
  selector: 'app-editar-pais',
  templateUrl: './editar-pais.component.html',
  styleUrls: ['./editar-pais.component.css']
})
export class EditarPaisComponent implements OnInit {

  paises: Paises = null;

  constructor(
    private paisService: PaisesService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params.id;
    alert(id);
  }

}
