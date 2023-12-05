import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  
  private formData: any;
  private id: number = -1;

  constructor() {}

  setProfessionalFormData(data: any) {
    this.formData = data;
  }

  getProfessionalFormData() {
    return this.formData;
  }

  setProfessionalId(id: number) {
    this.id = id;
  }

  getProfessionalId() {
    return this.id;
  }

  setPaisFormData(data: any) {
    this.formData = data;
  }

  getPaisFormData() {
    return this.formData;
  }

  setPaisId(id: number) {
    this.id = id;
  }

  getPaisId() {
    return this.id;
  }
}
