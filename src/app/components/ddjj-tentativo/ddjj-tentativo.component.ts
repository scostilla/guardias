import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ddjj-tentativo',
  templateUrl: './ddjj-tentativo.component.html',
  styleUrls: ['./ddjj-tentativo.component.css']
})
export class DdjjTentativoComponent {

  profesionales: any[] = [];

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      if (params['vector']) {
        this.profesionales = JSON.parse(params['vector']);
        console.log(this.profesionales);
        // Hacer lo que necesites con el vector profesionales
      }
    });
  }


}
