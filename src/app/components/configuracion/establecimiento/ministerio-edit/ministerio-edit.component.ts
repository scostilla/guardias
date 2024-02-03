import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ministerio } from 'src/app/models/Ministerio';
import { MinisterioService } from 'src/app/services/ministerio.service';
import { Localidad } from 'src/app/models/Localidad';
import { LocalidadService } from 'src/app/services/localidad.service';
import { Region } from 'src/app/models/Region';
import { RegionService } from 'src/app/services/region.service';

@Component({
  selector: 'app-ministerio-edit',
  templateUrl: './ministerio-edit.component.html',
  styleUrls: ['./ministerio-edit.component.css']
})

export class MinisterioEditComponent implements OnInit {

  ministerio?: Ministerio;
  localidades: Localidad[] = [];
  localidadesEncontrado?: Localidad;
  regiones: Region[] = [];
  regionesEncontrado?: Region;

  constructor(
    private ministerioService: MinisterioService,
    private localidadService: LocalidadService,
    private regionService: RegionService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<MinisterioEditComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit() {
    const id = this.data.id;
    this.ministerioService.detalle(id).subscribe(
      data=> {
        this.ministerio = data;
        this.ministerio.localidad.id = data.localidad.id;
        this.ministerio.region.id = data.region.id;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
      }
    );
    this.localidadService.lista().subscribe((data: Localidad[]) => {
      this.localidades = data;
      console.log(this.localidades);
    });
    this.regionService.lista().subscribe((data: Region[]) => {
      this.regiones = data;
      console.log(this.regiones);
    });

  }

  localidadChange() {
    if (this.ministerio) {
      const nombre = this.ministerio.localidad.nombre;
      this.localidadesEncontrado = this.localidades.find((localidad) => localidad.nombre === nombre);
    }  
  }

  regionChange() {
    if (this.ministerio) {
      const nombre = this.ministerio.region.nombre;
      this.regionesEncontrado = this.regiones.find((region) => region.nombre === nombre);
    }
  }


  onUpdate(): void {
    const id = this.data.id;
    console.log("onUpdate "+id);
    if(this.ministerio) {
      this.ministerio.localidad = this.localidadesEncontrado ? this.localidadesEncontrado : this.ministerio.localidad;
    this.ministerioService.update(id, this.ministerio).subscribe(
      data=> {
        this.toastr.success('ministerio Modificado', 'OK', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 7000, positionClass: 'toast-top-center'
        });
      }
    )
  }

  this.dialogRef.close();

  }

  cancel() {
    this.dialogRef.close();
  }

  }

