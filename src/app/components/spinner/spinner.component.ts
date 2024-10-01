import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})

export class SpinnerComponent implements OnInit {

  showSpinner!: Observable<boolean>; 

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.showSpinner = this.spinnerService.getSpinnerObserver(); 
  }

}