import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})

export class SpinnerComponent implements OnInit {

  showSpinner: boolean = false;
  private subscription: any;

  constructor(private spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef // Inyectar ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    // Suscribirse al Observable del spinner después de que la vista se haya inicializado
    this.subscription = this.spinnerService.getSpinnerObserver().subscribe(
      (show: boolean) => {
        this.showSpinner = show;
        this.cdr.detectChanges(); // Notificar a Angular sobre los cambios
      }
    );
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}