import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  private formData: any;
  private sendFormData: boolean = false;
  private id: number = -1;

  constructor() {}

  setSendFormData(value: boolean) {
    this.sendFormData = value;
  }

  getSendFormData(){
    return this.sendFormData;
  }

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
