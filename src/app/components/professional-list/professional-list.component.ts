import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api-service.service';
import ConsultaProfesional from 'src/server/models/ConsultaProfesional';
import Legajo from 'src/server/models/Legajo';
import Persona from 'src/server/models/Persona';
import Profesional from 'src/server/models/Profesional';
import { DataSharingService } from '../../services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ProfessionalAbmComponent } from '../professional-abm/professional-abm.component';

export interface UserData {
  id: number;
  dni: number;
  cuil: string;
  nombre: string;
  apellido: string;
  especialidad: string;
}

@Component({
  selector: 'app-professional-list',
  templateUrl: './professional-list.component.html',
  styleUrls: ['./professional-list.component.css'],
})
export class ProfessionalListComponent implements OnInit, AfterViewInit {
  profesionales?: ConsultaProfesional[] | undefined;
  profesional?: ConsultaProfesional;
  profesionalEncontrado?: ConsultaProfesional;
  newProfesional!: Profesional;
  persona!: Persona;
  newLegajo!: Legajo;
  idPersona?: number;
  idLegajo?: number;
  idRevista?: number;
  fechaInicio?: Date;
  fechaResolucion?: Date;
  displayedColumns: string[] = [
    'id',
    'cuil',
    'nombre',
    'apellido',
    'dni',
    'especialidad',
    'actions',
  ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private paginatorLabels: MatPaginatorIntl,
    private dataSharingService: DataSharingService,
    private apiServiceService: ApiServiceService
  ) {
    paginatorLabels.itemsPerPageLabel = 'Items por pagina';
    paginatorLabels.firstPageLabel = 'Primera Pagina';
    paginatorLabels.nextPageLabel = 'Siguiente';
    paginatorLabels.previousPageLabel = 'Anterior';
    this.dataSource = new MatTableDataSource<UserData>([]);
    this.newProfesional = new Profesional();
  }

  ngOnInit() {
    //this.getProfesionales();
    this.http
    .get<UserData[]>('../../../assets/jsonFiles/profesionales.json')
    .subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  private getProfesionales() {
    this.apiServiceService.getProfesionales().subscribe((data) => {
      this.profesionales = data;

      const userDataArray: UserData[] = data.map((profesional) => {
        return {
          id: profesional.idProfesional || -1,
          dni: profesional.dni || 0,
          cuil: profesional.cuil || '',
          nombre: profesional.nombre || '',
          apellido: profesional.apellido || '',
          profesion: profesional.profesion || '',
          especialidad: profesional.especialidad || '',
          sitRevista: profesional.sitRevista || '',
          cargaHoraria: profesional.cargaHoraria || '',
          cargo: profesional.cargo || '',
          adicional: profesional.adicional || '',
          categoria: profesional.categoria || '',
          udo: profesional.udo || '',
          hospital: profesional.hospital || '',
          idHospital: profesional.idHospital || -1,
          idCargo: profesional.idCargo || -1,
          idDistribucionHoraria: profesional.idDistribucionHoraria || -1,
          idEspecialidad: profesional.idEspecialidad || -1,
          idLegajo: profesional.idLegajo || -1,
          idPersona: profesional.idPersona || -1,
          idProfesion: profesional.idProfesion || -1,
          idProfesional: profesional.idProfesional || -1,
          idTipoGuardia: profesional.idTipoGuardia || -1,
          idUdo: profesional.idUdo || -1,
          matricula: profesional.matricula || '',
          tipoGuardia: profesional.tipoGuardia || '',
        };
      });

      this.dataSource.data = userDataArray;
      console.log(this.dataSource.data);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addEditProfessional(id: number) {
    const dialogRef = this.dialog.open(ProfessionalAbmComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(this.dataSharingService.getProfessionalFormData());
      this.dataSource.data.push(this.dataSharingService.getProfessionalFormData());
      console.log("id recibido: "+this.dataSharingService.getProfessionalId());
    });
  }
/*
  addEditProfessional(id: number) {
    const dialogRef = this.dialog.open(ProfessionalAbmComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      this.profesional = new ConsultaProfesional();
      this.persona = new Persona();
      this.profesional = this.dataSharingService.getProfessionalFormData();
      console.log(this.profesional);
      if (this.profesionales) {
        this.profesionalEncontrado = this.profesionales.find(
          (profesional) => profesional.idProfesional === id
        );
        console.log('profesional encontrado: ');
        console.log(this.profesionalEncontrado);
        console.log('submit: ' + this.dataSharingService.getSendFormData());
      }

      if (this.dataSharingService.getSendFormData()) {
        if (this.dataSharingService.getProfessionalId() == -1) {
          //this.savePersona();
        } else {
          //modificar profesional
        }
      }
    });
  }
*/
  public savePersona() {
    this.persona = {};

    if (this.profesional) {
      this.persona.nombre = this.profesional.nombre;
      this.persona.apellido = this.profesional.apellido;
      this.persona.dni = this.profesional.dni;
      this.persona.cuil = this.profesional.cuil;
      this.persona.direccion = '';
      this.persona.email = '';
      this.persona.sexo = '';
      this.persona.telefono = '';
      this.persona.idCargo = -3;
      this.persona.estado = 1;

      const idHospitalObservable = this.profesional.hospital
        ? this.buscarId(
            this.profesional.hospital,
            '../assets/jsonFiles/hospitales.json'
          )
        : of(-1);

      const idUdoObservable = this.profesional.udo
        ? this.buscarId(
            this.profesional.udo,
            '../assets/jsonFiles/hospitales.json'
          )
        : of(-1);

      const idProfesionObservable = this.profesional.profesion
        ? this.buscarId(
            this.profesional.profesion,
            '../assets/jsonFiles/profesion.json'
          )
        : of(-1);

      const idCargoObservable = this.profesional.cargo
        ? this.buscarId(
            this.profesional.cargo,
            '../assets/jsonFiles/cargo.json'
          )
        : of(-1);

      forkJoin([
        idHospitalObservable,
        idUdoObservable,
        idProfesionObservable,
        idCargoObservable,
      ])
        .pipe(
          switchMap(([idHospital, idUdo, idProfesion, idCargo]) => {
            this.persona.idHospital = idHospital;
            this.persona.idUdo = idUdo;
            this.persona.idProfesion = idProfesion;
            this.persona.idCargo = idCargo;

            if (
              this.profesional?.sitRevista &&
              this.profesional?.categoria &&
              this.profesional?.adicional &&
              this.profesional?.cargaHoraria
            ) {
              return this.apiServiceService.getRevistaId(
                this.profesional.sitRevista,
                this.profesional.categoria,
                this.profesional.adicional,
                this.profesional.cargaHoraria
              );
            } else {
              return of(null);
            }
          })
        )
        .subscribe(
          (revistaId) => {
            if (revistaId !== null) {
              this.idRevista = revistaId;
              console.log('Revista ID:', this.idRevista);
            }

            this.apiServiceService.savePersona(this.persona).subscribe(
              (idPersona) => {
                if (idPersona !== -1) {
                  this.idPersona = idPersona;
                  console.log('ID de persona creada:', this.idPersona);
                  this.saveLegajo();
                  this.saveProfesional();
                } else {
                  console.error('Error al crear persona');
                }
              },
              (error) => {
                console.error('Error al guardar persona:', error);
              }
            );
          },
          (error) => {
            console.error('Error al buscar IDs:', error);
          }
        );
    }
  }

  public saveProfesional() {
    if (this.profesional) {
      this.newProfesional.idPersona = this.idPersona;
      this.newProfesional.matricula = this.profesional.matricula;

      const idEspecialidadObservable = this.profesional.especialidad
        ? this.buscarId(
            this.profesional.especialidad,
            '../assets/jsonFiles/especialidades.json'
          )
        : of(-1);

      const idCargaHorariaObservable = this.profesional.cargaHoraria
        ? this.buscarId(
            this.profesional.cargaHoraria,
            '../assets/jsonFiles/cargaHoraria.json'
          )
        : of(-1);

      const idTipoGuardiaObservable = this.profesional.tipoGuardia
        ? this.buscarId(
            this.profesional.tipoGuardia,
            '../assets/jsonFiles/tipoGuardia.json'
          )
        : of(-1);

      forkJoin([
        idEspecialidadObservable,
        idCargaHorariaObservable,
        idTipoGuardiaObservable,
      ])
        .pipe(
          switchMap(
            ([idEspecialidad, idDistribucionHoraria, idTipoGuardia]) => {
              this.newProfesional.idEspecialidad = idEspecialidad;
              this.newProfesional.idDistribucionHoraria = idDistribucionHoraria;
              this.newProfesional.idTipoGuardia = idTipoGuardia;

              return this.apiServiceService.saveProfesional(
                this.newProfesional
              );
            }
          )
        )
        .subscribe(
          (idProfesional) => {
            if (idProfesional !== -1) {
              this.newProfesional.idProfesional = idProfesional;
              console.log(
                'ID del profesional creado:',
                this.newProfesional.idProfesional
              );
            } else {
              console.error('Error al crear el profesional');
            }
          },
          (error) => {
            console.error('Error al guardar el profesional:', error);
          }
        );

      console.log(this.newProfesional);
    }
  }

  public saveLegajo() {
    this.newLegajo.idPersona = this.idPersona;
    this.newLegajo.idRevista = this.idRevista;
    this.newLegajo.estado = true;
    this.newLegajo.fechaInicio = new Date();
    this.newLegajo.fechaResolucion = new Date();

    this.apiServiceService.saveLegajo(this.newLegajo).subscribe(
      (idLegajo: number) => {
        this.idLegajo = idLegajo;
        console.log('idLegajo guardado:', this.idLegajo);
      },
      (error) => {
        console.error('Error al guardar el legajo:', error);
      }
    );
  }

  //removeProfessional POR AHORA SOLO ELIMINA EL ELEMENTO EN LA VISTA
  removeProfessional(id: number, nombre: string, apellido: string) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          message: 'Confirma la eliminación de ' + nombre + ' ' + apellido,
          title: 'Eliminar',
        },
      })
      .afterClosed()
      .subscribe((confirm: Boolean) => {
        if (confirm) {
          console.log('remove Professional id: ' + id);
          const index = this.dataSource.data.findIndex(
            (element) => element.id === id
          );
          if (index > -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription();
          }
        } else {
          this.dialog.closeAll();
        }
      });
  }

  buscarId(valor: string, jsonUrl: string): Observable<number> {
    return this.http.get<any[]>(jsonUrl).pipe(
      map((data) => {
        const elementoEncontrado = data.find(
          (item) => item.descripcion === valor
        );
        return elementoEncontrado ? elementoEncontrado.id : -1;
      })
    );
  }
}
