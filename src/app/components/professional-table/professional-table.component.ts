import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ProfessionalDataServiceService } from '../../services/professional-data-service.service';

export interface UserData {
  id: number;
  cuil: string;
  apellido: string;
  nombre: string;
  profesion: string;
}

@Component({
  selector: 'app-professional-table',
  templateUrl: './professional-table.component.html',
  styleUrls: ['./professional-table.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
})
export class ProfessionalTableComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'cuil',
    'apellido',
    'nombre',
    'profesion',
  ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private professionalDataService: ProfessionalDataServiceService
  ) {
    this.dataSource = new MatTableDataSource<UserData>([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.http
      .get<UserData[]>('../../../assets/jsonFiles/profesionales.json')
      .subscribe((data) => {
        this.dataSource.data = data;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRowDoubleClick(row: any) {
    // Imprime los datos de la fila seleccionada en la consola
    console.log('id:', row.id);
    console.log('cuil:', row.cuil);
    console.log('nombre:', row.nombre);
    console.log('apellido:', row.apellido);
    console.log('profesion:', row.profesion);
    this.professionalDataService.selectedId = row.id;
    this.professionalDataService.selectedCuil = row.cuil;
    this.professionalDataService.selectedNombre = row.nombre;
    this.professionalDataService.selectedApellido = row.apellido;
    this.professionalDataService.selectedProfesion = row.profesion;
  }
}