import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-spinner',
  template: `
    <div class="spinner" *ngIf="showSpinner | async"> <!-- Uso del operador async -->
    <div class="overlay"></div> 
    <mat-progress-spinner diameter="50" mode="indeterminate"></mat-progress-spinner>
</div>
  `,
  styleUrls: ['./spinner.component.css']
})

export class SpinnerComponent implements OnInit {

  showSpinner!: Observable<boolean>; // Variable para mostrar u ocultar el spinner

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.showSpinner = this.spinnerService.getSpinnerObserver(); // Asignación del observable del estado del spinner
  }

}