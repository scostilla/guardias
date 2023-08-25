import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiServiceService } from 'src/app/services/api-service.service';
import Profesional from 'src/server/models/ConsultaProfesional';
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
  profesionales?: Profesional[]  | undefined;
  profesional?: Profesional;
  profesionalEncontrado?: Profesional;
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
          id: profesional.idProfesional || 0,
          dni: profesional.dni || 0,
          cuil: profesional.cuil || '',
          nombre: profesional.nombre || '',
          apellido: profesional.apellido || '',
          profesion: profesional.profesion ||'',
          especialidad: profesional.especialidad || '',
          sitRevista: profesional.sitRevista || '',
          cargaHoraria: profesional.cargaHoraria || '',
          adicional: profesional.adicional || '',
          categoria: profesional.categoria || '',
          udo: profesional.udo || '',
          hospital: profesional.hospital || '',
          idHospital: profesional.idHospital || 0,
        };
      });

      this.dataSource.data = userDataArray;
      console.log(this.profesionales);
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
      this.profesional = this.dataSharingService.getProfessionalFormData();
      console.log(this.profesional);
      if (this.profesionales) {
      this.profesionalEncontrado = this.profesionales.find(profesional => profesional.idProfesional === id);
      console.log("profesional encontrado: ");
      console.log(this.profesionalEncontrado);
      }
      this.dataSource.data.push(
        this.dataSharingService.getProfessionalFormData()
      );
      console.log(
        'id recibido: ' + this.dataSharingService.getProfessionalId()
      );
    });
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
}
