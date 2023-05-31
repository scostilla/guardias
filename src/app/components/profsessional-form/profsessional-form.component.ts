import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { ProfessionalDataServiceService } from '../../services/professional-data-service.service';

@Component({
  selector: 'app-profsessional-form',
  templateUrl: './profsessional-form.component.html',
  styleUrls: ['./profsessional-form.component.css']
})

export class ProfsessionalFormComponent {
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

    // Puedes suscribirte a eventos del diálogo, como 'afterClosed', para realizar acciones después de cerrarlo
    dialogRef.afterClosed().subscribe((result) => {
      console.log('El popup se ha cerrado');
    });
  }
  selectedId: string | undefined;
  selectedCuil: string | undefined;
  selectedNombre: string | undefined;
  selectedApellido: string | undefined;
  selectedProfesion: string | undefined;

  ngOnInit() {
    // Accede a los datos seleccionados del servicio y haz lo que necesites con ellos
    console.log(this.professionalDataService.selectedId);
    console.log(this.professionalDataService.selectedCuil);
    console.log(this.professionalDataService.selectedNombre);
    console.log(this.professionalDataService.selectedApellido);
    console.log(this.professionalDataService.selectedProfesion);

    this.selectedId = this.professionalDataService.selectedId;
    this.selectedCuil = this.professionalDataService.selectedCuil;
    this.selectedNombre = this.professionalDataService.selectedNombre;
    this.selectedApellido = this.professionalDataService.selectedApellido;
    this.selectedProfesion = this.professionalDataService.selectedProfesion;
  }
}
