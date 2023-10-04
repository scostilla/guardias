import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-cronograma-reg',
  templateUrl: './cronograma-reg.component.html',
  styleUrls: ['./cronograma-reg.component.css'],
})
export class CronogramaRegComponent implements OnInit {
  hospitales?: any[];
  hospitalesFiltrados?: any[];
  profesionales?: any[];
  profPorRegion?: any[];

  descubiertoDomingo: any[] = [];
  descubiertoLunes: any[] = [];
  descubiertoMartes: any[] = [];
  descubiertoMiercoles: any[] = [];
  descubiertoJueves: any[] = [];
  descubiertoViernes: any[] = [];
  descubiertoSabado: any[] = [];

  selectedRegion: string = 'CENTRO';
  hospitalSeleccionado: any;
  class?: string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.hospitales = data;
        this.filtrarHospitalPorRegion();
      });
  }

  selectRegion(region: string) {
    this.selectedRegion = region;
    this.filtrarHospitalPorRegion();
    console.log(this.hospitalesFiltrados);
  }

  filtrarHospitalPorRegion() {
    if (this.hospitales) {
      this.hospitalesFiltrados = this.hospitales.filter((hospital) => {
        return hospital.region == this.selectedRegion;
      });
      console.log(this.hospitalesFiltrados);
      this.profesionalesPorRegion();
      //INICIALIZANDO LOS VECTORES EN DESCUBIERTO
      this.descubiertoDomingo.length = 0;
      this.descubiertoLunes.length = 0;
      this.descubiertoMartes.length = 0;
      this.descubiertoMiercoles.length = 0;
      this.descubiertoJueves.length = 0;
      this.descubiertoViernes.length = 0;
      this.descubiertoSabado.length = 0;
      if (this.hospitalesFiltrados) {
        for (const hospital of this.hospitalesFiltrados) {
          const nuevoDescubierto = {
            nombreHospital: hospital.descripcion,
            descubierto: true,
          };
          this.descubiertoDomingo.push({ ...nuevoDescubierto });
          this.descubiertoLunes.push({ ...nuevoDescubierto });
          this.descubiertoMartes.push({ ...nuevoDescubierto });
          this.descubiertoMiercoles.push({ ...nuevoDescubierto });
          this.descubiertoJueves.push({ ...nuevoDescubierto });
          this.descubiertoViernes.push({ ...nuevoDescubierto });
          this.descubiertoSabado.push({ ...nuevoDescubierto });
        }
      }
      //TERMINA LA INICIALIZACION DED VECTORES
    } else {
      console.log('nola');
    }
  }

  profesionalesPorRegion() {
    this.profPorRegion = [];
    if (this.hospitalesFiltrados) {
      const observables = this.hospitalesFiltrados.map((hospital) => {
        return this.http
          .get<any[]>('../assets/jsonFiles/profesionales.json')
          .pipe(
            map((data) => {
              return data.filter(
                (profesional) => profesional.hospital === hospital.descripcion
              );
            })
          );
      });

      forkJoin(observables).subscribe((result) => {
        result.forEach((profesionalesPorHospital) => {
          this.profPorRegion?.push(...profesionalesPorHospital);
        });
        console.log(this.profPorRegion);
        this.buscarDescubiertos();
      });
    }
  }

  buscarDescubiertos() {
    if (this.profPorRegion) {
      let encontrado = false;
      for (const profesional of this.profPorRegion) {
        if (!encontrado && (profesional.cargoDomingo || profesional.extraDomingo || profesional.contrafacturaDomingo || profesional.agrupacionDomingo)) {
          const indice = this.descubiertoDomingo.findIndex(
            (descubierto) => descubierto.nombreHospital === profesional.hospital
          );
          if (indice !== -1) {
            this.descubiertoDomingo[indice].descubierto = false;
            encontrado = false;
          }
        }
      }
      console.log("domingo");
      console.log(this.descubiertoDomingo);

      encontrado = false;
      for (const profesional of this.profPorRegion) {
        if (!encontrado && (profesional.cargoLunes || profesional.extraLunes || profesional.contrafacturaLunes || profesional.agrupacionLunes)) {
          const indice = this.descubiertoLunes.findIndex(
            (descubierto) => descubierto.nombreHospital === profesional.hospital
          );
          if (indice !== -1) {
            this.descubiertoLunes[indice].descubierto = false;
            encontrado = false;
          }
        }
      }
      console.log("lunes");
      console.log(this.descubiertoLunes);
      encontrado = false;
      for (const profesional of this.profPorRegion) {
        if (!encontrado && (profesional.cargoMartes || profesional.extraMartes || profesional.contrafacturaMartes || profesional.agrupacionMartes)) {
          const indice = this.descubiertoMartes.findIndex(
            (descubierto) => descubierto.nombreHospital === profesional.hospital
          );
          if (indice !== -1) {
            this.descubiertoMartes[indice].descubierto = false;
            encontrado = false;
          }
        }
      }
      console.log("martes");
      console.log(this.descubiertoMartes);

      encontrado = false;
      for (const profesional of this.profPorRegion) {
        if (!encontrado && (profesional.cargoMiercoles || profesional.extraMiercoles || profesional.contrafacturaMiercoles || profesional.agrupacionMiercoles)) {
          const indice = this.descubiertoMiercoles.findIndex(
            (descubierto) => descubierto.nombreHospital === profesional.hospital
          );
          if (indice !== -1) {
            this.descubiertoMiercoles[indice].descubierto = false;
            encontrado = false;
          }
        }
      }
      console.log("miercoles");
      console.log(this.descubiertoMiercoles);

      encontrado = false;
      for (const profesional of this.profPorRegion) {
        if (!encontrado && (profesional.cargoJueves || profesional.extraJueves || profesional.contrafacturaJueves || profesional.agrupacionJueves)) {
          const indice = this.descubiertoJueves.findIndex(
            (descubierto) => descubierto.nombreHospital === profesional.hospital
          );
          if (indice !== -1) {
            this.descubiertoJueves[indice].descubierto = false;
            encontrado = false;
          }
        }
      }
      console.log("jueves");
      console.log(this.descubiertoJueves);

      encontrado = false;
      for (const profesional of this.profPorRegion) {
        if (!encontrado && (profesional.cargoViernes || profesional.extraViernes || profesional.contrafacturaViernes || profesional.agrupacionViernes)) {
          const indice = this.descubiertoViernes.findIndex(
            (descubierto) => descubierto.nombreHospital === profesional.hospital
          );
          if (indice !== -1) {
            this.descubiertoViernes[indice].descubierto = false;
            encontrado = false;
          }
        }
      }
      console.log("viernes");
      console.log(this.descubiertoViernes);

      encontrado = false;
      for (const profesional of this.profPorRegion) {
        if (!encontrado && (profesional.cargoSabado || profesional.extraSabado || profesional.contrafacturaSabado || profesional.agrupacionSabado)) {
          const indice = this.descubiertoSabado.findIndex(
            (descubierto) => descubierto.nombreHospital === profesional.hospital
          );
          if (indice !== -1) {
            this.descubiertoSabado[indice].descubierto = false;
            encontrado = false;
          }
        }
      }
      console.log("sabado");
      console.log(this.descubiertoSabado);
    }
  }
}
