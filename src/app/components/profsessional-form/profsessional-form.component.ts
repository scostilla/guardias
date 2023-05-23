import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchPopupComponent } from '../search-popup/search-popup.component';


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
      console.log("true option "+this.disableButton);
    } else {
      this.disableButton = false;
      console.log("false option "+this.disableButton);
    }
  }

  constructor(private dialog: MatDialog) {}

  openPopup() {
    const dialogRef = this.dialog.open(SearchPopupComponent, {
      width: '400px',
    });

    // Puedes suscribirte a eventos del diálogo, como 'afterClosed', para realizar acciones después de cerrarlo
    dialogRef.afterClosed().subscribe(result => {
      console.log('El popup se ha cerrado');
    });
  }

}
