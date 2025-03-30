import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cronograma-detail',
  templateUrl: './cronograma-detail.component.html',
  styleUrls: ['./cronograma-detail.component.css']
})
export class CronogramaDetailComponent {
  @Output() eventDeleted = new EventEmitter<void>();  // Emitimos un evento para notificar que se ha eliminado un cronograma

  constructor(
    public dialogRef: MatDialogRef<CronogramaDetailComponent>,
    private cronoService: CronogramaTentativoService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  deleteEvent(event: any): void {
    if (confirm('¿Estás seguro de que deseas eliminar este cronograma?')) {
      // Suponiendo que event contiene el ID del cronograma
      this.cronoService.delete(event.id).subscribe(
        response => {
          this.toastr.success('Cronograma eliminado con éxito', 'Éxito', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });

          // Filtramos el evento eliminado de la lista de eventos y actualizamos el diálogo
          const updatedEvents = this.data.events.filter((e: any) => e.id !== event.id);
          this.data.events = updatedEvents;  // Actualizamos los eventos directamente en el diálogo

          // Emitimos el evento para notificar al componente principal
          this.eventDeleted.emit();  // Notificamos que un evento fue eliminado
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
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
