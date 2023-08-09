import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfessionalDataServiceService } from 'src/app/services/ProfessionalDataService/Professional-data-service.service';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-guardia-activa',
  templateUrl: './guardia-activa.component.html',
  styleUrls: ['./guardia-activa.component.css']
})
export class GuardiaActivaComponent {
  selectedService:string='consultorio';
  selectedGuard: string = '';
  disableButton: boolean = this.selectedGuard == '';

  updateButtonState(): void {
    if (this.selectedGuard == '') {
      this.disableButton = true;
      console.log('true option ' + this.disableButton);
    } else {
      this.disableButton = false;
      console.log('false option ' + this.disableButton);
    }
  }

  constructor(
    private dialog: MatDialog,
    private professionalDataService: ProfessionalDataServiceService
  ) {}

  openPopup(componentParameter: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '1000px',
    });

    dialogRef.componentInstance.componentParameter = componentParameter;

    dialogRef.afterClosed().subscribe((result) => {
      console.log('popup closed');
    });
  }
  selectedId: string | undefined;
  selectedCuil: string | undefined;
  selectedNombre: string | undefined;
  selectedApellido: string | undefined;
  selectedProfesion: string | undefined;

  ngOnInit() {

    this.professionalDataService.dataUpdated.subscribe(() => {
      this.selectedId = this.professionalDataService.selectedId;
      this.selectedCuil = this.professionalDataService.selectedCuil;
      this.selectedNombre = this.professionalDataService.selectedNombre;
      this.selectedApellido = this.professionalDataService.selectedApellido;
      this.selectedProfesion = this.professionalDataService.selectedProfesion;
    });
  }
}
