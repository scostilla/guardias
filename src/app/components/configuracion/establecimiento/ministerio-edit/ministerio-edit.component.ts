import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ministerio } from 'src/app/models/Configuracion/Ministerio';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { Localidad } from 'src/app/models/Configuracion/Localidad';
import { LocalidadService } from 'src/app/services/Configuracion/localidad.service';
import { Region } from 'src/app/models/Configuracion/Region';
import { RegionService } from 'src/app/services/Configuracion/region.service';


@Component({
  selector: 'app-ministerio-edit',
  templateUrl: './ministerio-edit.component.html',
  styleUrls: ['./ministerio-edit.component.css']
})
export class MinisterioEditComponent implements OnInit {

  form?: FormGroup;
  esEdicion?: boolean;
  esIgual: boolean = false;
  localidades: Localidad[] = []; 
  regiones: Region[] = []; 
  


  constructor(
    private fb: FormBuilder,
    private ministerioService: MinisterioService,
    private localidadService: LocalidadService, 
    private regionService: RegionService, 
    private dialogRef: MatDialogRef<MinisterioEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Ministerio 
  ) { 
    this.listLocalidad();
    this.listRegion();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data ? this.data.id : null],
      nombre: [this.data ? this.data.nombre : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      domicilio: [this.data ? this.data.domicilio : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9., ]{3,80}$')]],
      observacion: [this.data ? this.data.observacion : '', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9., ]{3,80}$')]],
      telefono: [this.data ? this.data.telefono : '', [Validators.pattern('^[0-9]{9,15}$')]],
      localidad: [this.data ? this.data.localidad : '', Validators.required],
      region: [this.data ? this.data.region : '', Validators.required],
      estado: [this.data ? this.data.estado : '', Validators.required],
      idCabecera: [this.data ? this.data.idCabecera : ''],
      idAutoridad: [this.data ? this.data.idAutoridad : '']
    });

    this.esEdicion = this.data != null;
    
    this.form.valueChanges.subscribe(val => {
    this.esIgual = val.id !== this.data?.id || val.nombre !== this.data?.nombre || val.domicilio !== this.data?.domicilio || val.observacion !== this.data?.observacion
    || val.telefono !== this.data?.telefono || val.localidad !== this.data?.localidad || val.region !== this.data?.region || val.estado !== this.data?.estado
    || val.idCabecera !== this.data?.idCabecera || val.idAutoridad !== this.data?.idAutoridad;
    });

  }

  listLocalidad(): void {
    this.localidadService.list().subscribe(data => {
      this.localidades = data;
    }, error => {
      console.log(error);
    });
  }

  listRegion(): void {
    this.regionService.list().subscribe(data => {
      this.regiones = data;
    }, error => {
      console.log(error);
    });
  }

  saveMinisterio(): void {
    const id = this.form?.get('id')?.value;
    let nombre = this.form?.get('nombre')?.value;
    const domicilio = this.form?.get('domicilio')?.value;
    const observacion = this.form?.get('observacion')?.value;
    const telefono = this.form?.get('telefono')?.value;
    const localidad = this.form?.get('localidad')?.value;
    const region = this.form?.get('region')?.value;
    const estado = this.form?.get('estado')?.value;
    const idCabecera = this.form?.get('idCabecera')?.value;
    const idAutoridad = this.form?.get('idAutoridad')?.value;

    nombre = nombre.toUpperCase();

    const ministerio = new Ministerio(domicilio, observacion, telefono, nombre, localidad, region, estado, idCabecera, idAutoridad);
    ministerio.id = id;

    if (this.esEdicion) {
      this.ministerioService.update(id, ministerio).subscribe(data => {
        this.dialogRef.close(data);
      });
    } else {
      this.ministerioService.save(ministerio).subscribe(data => {
        this.dialogRef.close(data);
      });
    }
  }

  compareLocalidad(p1: Localidad, p2: Localidad): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareRegion(p1: Region, p2: Region): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}