import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cronograma-p-hos',
  templateUrl: './cronograma-p-hos.component.html',
  styleUrls: ['./cronograma-p-hos.component.css'],
})
export class CronogramaPHosComponent {
  profesionales: any[] | undefined;
  hospitales: any[] | undefined;
  especialidades: any[] | undefined;
  especialidadSeleccionada: any;

  profesionalesFiltrados?: any[];

  profDomingo: any[] = [];
  profLunes: any[] = [];
  profMartes: any[] = [];
  profMiercoles: any[] = [];
  profJueves: any[] = [];
  profViernes: any[] = [];
  profSabado: any[] = [];


  constructor(public dialogReg: MatDialog, private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.hospitales = data.filter((options) => options.pasivas == true);
      });

    this.http
      .get<any[]>('../assets/jsonFiles/especialidades.json')
      .subscribe((data) => {
        this.especialidades = data.filter(
          (options) => options.pasiva === 'true'
        );
        this.especialidadSeleccionada = this.especialidades[0];
        console.log(this.especialidades);
        console.log(this.especialidadSeleccionada.descripcion);
      });

    this.http
      .get<any[]>('../assets/jsonFiles/profesionalesPasivas.json')
      .subscribe((data) => {
        this.profesionales = data;
      });
  }

  seleccionarEspecialidad(especialidad: any) {
    this.especialidadSeleccionada = especialidad;
    this.profesionalesFiltrados = [];

    this.profDomingo = [];
    this.profLunes = [];
    this.profMartes = [];
    this.profMiercoles = [];
    this.profJueves = [];
    this.profViernes = [];
    this.profSabado = [];

    this.filtrarProfesionalesPorServicio()

    if(this.profesionalesFiltrados){
      for (let i = 0; i < this.profesionalesFiltrados.length; i++) {

        if(this.profesionalesFiltrados[i].pasivaDomingo){
          //EXTERME HARDCODE ALERT!!!!!!!!!!!!
          this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].pasivaDomingo;
          this.profDomingo.push(this.profesionalesFiltrados[i]);
        }

        if(this.profesionalesFiltrados[i].pasivaLunes){
          //EXTERME HARDCODE ALERT!!!!!!!!!!!!
          this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].pasivaLunes;
          this.profLunes.push(this.profesionalesFiltrados[i]);
        }

        if(this.profesionalesFiltrados[i].pasivaMartes){
          //EXTERME HARDCODE ALERT!!!!!!!!!!!!
          this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].pasivaMartes;
          this.profMartes.push(this.profesionalesFiltrados[i]);
        }

        if(this.profesionalesFiltrados[i].pasivaMiercoles){
          //EXTERME HARDCODE ALERT!!!!!!!!!!!!
          this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].pasivaMiercoles;
          this.profMiercoles.push(this.profesionalesFiltrados[i]);
        }

        if(this.profesionalesFiltrados[i].pasivaJueves){
          //EXTERME HARDCODE ALERT!!!!!!!!!!!!
          this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].pasivaJueves;
          this.profJueves.push(this.profesionalesFiltrados[i]);
        }

        if(this.profesionalesFiltrados[i].pasivaViernes){
          //EXTERME HARDCODE ALERT!!!!!!!!!!!!
          this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].pasivaViernes;
          this.profViernes.push(this.profesionalesFiltrados[i]);
        }

        if(this.profesionalesFiltrados[i].pasivaSabado){
          //EXTERME HARDCODE ALERT!!!!!!!!!!!!
          this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].pasivaSabado;
          this.profSabado.push(this.profesionalesFiltrados[i]);
        }


      }

    }
  }


  filtrarProfesionalesPorServicio() {
    if (this.profesionales) {
      this.profesionalesFiltrados = this.profesionales.filter((profesional) => {
        return profesional.especialidad == this.especialidadSeleccionada.descripcion;
      });
    }
  }
}
