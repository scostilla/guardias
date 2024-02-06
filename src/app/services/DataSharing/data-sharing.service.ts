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

  setHospitalFormData(data: any) {
    this.formData = data;
  }

  getHospitalFormData() {
    return this.formData;
  }

  setHospitalId(id: number) {
    this.id = id;
  }

  getHospitalId() {
    return this.id;
  }

  setCapsFormData(data: any) {
    this.formData = data;
  }

  getCapsFormData() {
    return this.formData;
  }

  setCapsId(id: number) {
    this.id = id;
  }

  getCapsId() {
    return this.id;
  }

  setRegionFormData(data: any) {
    this.formData = data;
  }

  getRegionFormData() {
    return this.formData;
  }

  setRegionId(id: number) {
    this.id = id;
  }

  getRegionId() {
    return this.id;
  }

  setFeriadoFormData(data: any) {
    this.formData = data;
  }

  getFeriadoFormData() {
    return this.formData;
  }

  setFeriadoId(id: number) {
    this.id = id;
  }

  getFeriadoId() {
    return this.id;
  }

  setNotificacionFormData(data: any) {
    this.formData = data;
  }

  getNotificacionFormData() {
    return this.formData;
  }

  setNotificacionId(id: number) {
    this.id = id;
  }

  getNotificacionId() {
    return this.id;
  }

  setProfesionFormData(data: any) {
    this.formData = data;
  }

  getProfesionFormData() {
    return this.formData;
  }

  setProfesionId(id: number) {
    this.id = id;
  }

  getProfesionId() {
    return this.id;
  }

  setEspecialidadFormData(data: any) {
    this.formData = data;
  }

  getEspecialidadFormData() {
    return this.formData;
  }

  setEspecialidadId(id: number) {
    this.id = id;
  }

  getEspecialidadId() {
    return this.id;
  }

}
