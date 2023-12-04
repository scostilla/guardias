import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  getPaisId() {
    throw new Error('Method not implemented.');
  }
  getPaisFormData(): any {
    throw new Error('Method not implemented.');
  }
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
}
