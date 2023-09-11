import { EventEmitter, Injectable } from '@angular/core';
import { ApiServiceService } from '../api-service.service';

@Injectable({
  providedIn: 'root',
})
export class ProfessionalDataServiceService {
  selectedId: any;
  selectedDni: any;
  selectedCuil: any;
  selectedNombre: any;
  selectedApellido: any;
  selectedProfesion: any;
  dataUpdated: EventEmitter<void> = new EventEmitter<void>();

  constructor(private apiService: ApiServiceService) {}

  /*
  getProfesional(): Observable<any> {
    return this.apiService.get('profesional');
  }

  getProfesionalById(userId: number): Observable<any> {
    return this.apiService.get(`profesional/${profesionalId}`);
  }

  createProfesional(user: any): Observable<any> {
    return this.apiService.post('profesional', profesional);
  }
*/


}
