import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { ProfessionalDataServiceService } from '../../services/professional-data-service.service';

@Component({
  selector: 'app-professional-form',
  templateUrl: './professional-form.component.html',
  styleUrls: ['./professional-form.component.css']
})

export class ProfessionalFormComponent {
  selectedService: string = 'consultorio';
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

  constructor(private dialog: MatDialog, private professionalDataService: ProfessionalDataServiceService) {}

  openPopup(componentParameter: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '800px',
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


    this.selectedId = this.professionalDataService.selectedId;
    this.selectedCuil = this.professionalDataService.selectedCuil;
    this.selectedNombre = this.professionalDataService.selectedNombre;
    this.selectedApellido = this.professionalDataService.selectedApellido;
    this.selectedProfesion = this.professionalDataService.selectedProfesion;
  }
}
