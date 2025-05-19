import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cronograma-detail',
  templateUrl: './cronograma-detail.component.html',
  styleUrls: ['./cronograma-detail.component.css']
})
export class CronogramaDetailComponent {
  @Output() eventDeleted = new EventEmitter<void>();  // Emito un evento para notificar que se ha eliminado un cronograma

  constructor(
    public dialogRef: MatDialogRef<CronogramaDetailComponent>,
    private cronoService: CronogramaTentativoService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  deleteEvent(event: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: '¿Estás seguro de que deseas eliminar la guardia de ' + event.title + '?',
        title: 'Eliminar guardia'
      }
    });

    // Suscríbete a la respuesta del diálogo
    dialogRef.afterClosed().subscribe(result => {
      if (result) {  // Si el usuario confirma
        this.cronoService.delete(event.id).subscribe(
          response => {
            this.toastr.success('Guardia tentativa eliminada con éxito', 'Éxito', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });

            // Filtro el evento eliminado de la lista de eventos y actualizo el dialog
            const updatedEvents = this.data.events.filter((e: any) => e.id !== event.id);
            this.data.events = updatedEvents;

            // Emitio el evento para notificar al componente principal
            this.eventDeleted.emit();
          },
          error => {
            this.toastr.error('Ocurrió un error al eliminar el cronograma', 'Error', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            console.error('Error al eliminar el cronograma:', error);
          }
        );
      }
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
