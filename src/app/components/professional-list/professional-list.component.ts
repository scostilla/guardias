import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, forkJoin, map, of } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api-service.service';
import ConsultaProfesional from 'src/server/models/ConsultaProfesional';
import Persona from 'src/server/models/Persona';
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
  persona!: Persona;
  idPersonal?: number;
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
  }

  ngOnInit() {
    this.getProfesionales();
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
          this.savePersona();
        } else {
          //modificar profesional
        }
      }
    });
  }

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
      this.persona.idLegajo = -4;

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
      ]).subscribe(
        ([idHospital, idUdo, idProfesion, idCargo]) => {
          this.persona.idHospital = idHospital;
          this.persona.idUdo = idUdo;
          this.persona.idProfesion = idProfesion;
          this.persona.idCargo = idCargo;

          this.apiServiceService.savePersona(this.persona).subscribe(
            (idPersonal) => {
              if (idPersonal !== -1) {
                this.idPersonal = idPersonal;
                console.log('ID de persona creada:', this.idPersonal);
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
