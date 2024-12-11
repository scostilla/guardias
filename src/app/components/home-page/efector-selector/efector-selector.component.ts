import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'; 
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { CapsService } from 'src/app/services/Configuracion/caps.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { Ministerio } from 'src/app/models/Configuracion/Ministerio';
import { Caps } from 'src/app/models/Configuracion/Caps';
import { Efector } from 'src/app/models/Configuracion/Efector';

@Component({
  selector: 'app-efector-selector',
  templateUrl: './efector-selector.component.html',
  styleUrls: ['./efector-selector.component.css']
})
export class EfectorSelectorComponent {
  tipoEfector: number | null = null; // Valor inicial del tipo de efector (Ministerio)
  efectorOptions: any[] = []; // Opciones filtradas para el select de efectores
  selectedEfector: number | null = null; // Efector seleccionado
  ministerios: Ministerio[] = [];
  hospitales: Hospital[] = [];
  caps: Caps[] = [];

  constructor(
    private dialogRef: MatDialogRef<EfectorSelectorComponent>,
    private hospitalService: HospitalService,
    private ministerioService: MinisterioService,
    private capsService: CapsService,
    private efectorService: EfectorService // El servicio para manejar el BehaviorSubject
  ) {
    // Cargar los datos de ministerios, hospitales y CAPS
    this.loadData();
  }

  loadData(): void {
    // Cargar los datos de ministerios, hospitales y CAPS
    this.listMinisterios();
    this.listHospitales();
    this.listCaps();
  }

  listMinisterios(): void {
    this.ministerioService.list().subscribe(data => {
      this.ministerios = data;
    }, error => {
      console.log(error);
    });
  }

  listHospitales(): void {
    this.hospitalService.list().subscribe(data => {
      this.hospitales = data;
    }, error => {
      console.log(error);
    });
  }

  listCaps(): void {
    this.capsService.list().subscribe(data => {
      this.caps = data;
    }, error => {
      console.log(error);
    });
  }

  // Manejar el cambio de tipo de efector (Ministerio, Hospital, CAPS)
  onTipoEfectorChange(event: any): void {
    const tipoEfector = event.value;

    // Filtrar las opciones de efectores según el tipo seleccionado
    if (tipoEfector === 1) { // Ministerio
      this.efectorOptions = this.ministerios;
    } else if (tipoEfector === 2) { // Hospital
      this.efectorOptions = this.hospitales;
    } else if (tipoEfector === 3) { // CAPS
      this.efectorOptions = this.caps;
    }

    // Restablecer la selección actual de efector
    this.selectedEfector = null;
  }

  // Cuando se selecciona un efector, se actualiza el BehaviorSubject
  onEfectorChange(): void {
    if (this.selectedEfector !== null) {
      console.log("ID del efector seleccionado dialog:", this.selectedEfector);
      // Cierra el diálogo y pasa el ID del efector seleccionado
      this.dialogRef.close(this.selectedEfector); // Cierra el diálogo y pasa el valor al componente principal
    } else {
      console.error("No se ha seleccionado un efector");
    }
  }
    
  // Cerrar el diálogo sin emitir valor
  closeDialog(): void {
    this.dialogRef.close(); // Cierra el diálogo sin pasar ningún resultado
  }
}
