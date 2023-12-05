import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaisService } from 'src/app/services/pais.service';
import { ToastrService } from 'ngx-toastr';
import { Pais } from 'src/app/models/pais';


@Component({
  selector: 'app-pais-detail',
  templateUrl: './pais-detail.component.html',
  styleUrls: ['./pais-detail.component.css']
})

export class PaisDetailComponent implements OnInit {

  pais?: Pais;

  constructor(
    private paisService: PaisService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,

  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.paisService.detail(id).subscribe(
      data=> {
        this.pais = data;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
        this.volver();
      }
    );

  }

  volver(): void {
    this.router.navigate(['/pais'])
  }
}
