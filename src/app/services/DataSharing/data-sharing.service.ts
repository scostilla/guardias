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

  setProvinciaFormData(data: any) {
    this.formData = data;
  }

  getProvinciaFormData() {
    return this.formData;
  }

  setProvinciaId(id: number) {
    this.id = id;
  }

  getProvinciaId() {
    return this.id;
  }


  setDepartamentoFormData(data: any) {
    this.formData = data;
  }

  getDepartamentoFormData() {
    return this.formData;
  }

  setDepartamentoId(id: number) {
    this.id = id;
  }

  getDepartamentoId() {
    return this.id;
  }


  setLocalidadFormData(data: any) {
    this.formData = data;
  }

  getLocalidadFormData() {
    return this.formData;
  }

  setLocalidadId(id: number) {
    this.id = id;
  }

  getLocalidadId() {
    return this.id;
  }

  setMinisterioFormData(data: any) {
    this.formData = data;
  }

  getMinisterioFormData() {
    return this.formData;
  }

  setMinisterioId(id: number) {
    this.id = id;
  }

  getMinisterioId() {
    return this.id;
  }


}
