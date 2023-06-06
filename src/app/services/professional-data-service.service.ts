import { Injectable, EventEmitter  } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfessionalDataServiceService {
  selectedId: any;
  selectedCuil: any;
  selectedNombre: any;
  selectedApellido: any;
  selectedProfesion: any;
  dataUpdated: EventEmitter<void> = new EventEmitter<void>();
  constructor() {}
}
