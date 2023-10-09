//import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { DialogServiceService } from 'src/app/services/DialogService/dialog-service.service';
import { ProfesionalTempService } from 'src/app/services/ProfesionalTemp/profesional-temp.service';
import { ProfessionalDataServiceService } from 'src/app/services/ProfessionalDataService/Professional-data-service.service';
import { ProfesionalService } from 'src/app/services/Servicio/profesional.service';
import Profesional from 'src/server/models/Profesional';

/* export interface UserData {
  id: number;
  cuil: string;
  apellido: string;
  nombre: string;
  profesion: string;
} */

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
  /* displayedColumns: string[] = [
    'id',
    'cuil',
    'apellido',
    'nombre',
    'profesion',
  ]; */
  dataSource: MatTableDataSource<Profesional>;
  profesionales: Profesional[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    //private http: HttpClient,
    private professionalDataService: ProfessionalDataServiceService, 
    private dialogService: DialogServiceService,
    private profesionalTemp: ProfesionalTempService,
    private profesionalService: ProfesionalService,
    private router: Router,
    
    public dialogRef: MatDialogRef<ProfessionalTableComponent>
    
  ) {
    this.dataSource = new MatTableDataSource<Profesional>([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.cargarProfesionales();
    this.profesionalService.lista().subscribe(
      profesionales => {
        this.dataSource.data  = profesionales;
      },
      );
      // Cambiarmos el valor de la variable para que todos los componentes que estan subscritos detecten el cambio
    //this.profesionalTemp.miVariable$.next(true);

    /* Aquí cargamos con JSON */
    /* this.http
      .get<UserData[]>('../../../assets/jsonFiles/profesionales.json')
      .subscribe((data) => {
        this.dataSource.data = data;
      }); */

  }

  seleccionar(id:any){
    this.profesionalTemp.profesionalTempId.next(id);
    console.log("########### id: " + id);
    this.cancel();
  }

  cargarProfesionales(): void {
    this.profesionalService.lista().subscribe(
      data => {
        this.profesionales = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRowDoubleClick(row: any) {
    
    console.log('professional table id:', row.idPersona);
    const id: NavigationExtras = {state: {example: row.idPersona}};
    console.log('professional table id:', id);
    this.router.navigate(['regDiario'],id);
    //console.log('professional table id:', id);
    this.professionalDataService.dataUpdated.emit();
    this.dialogService.closeDialog();

    /* Uso con JSon */
    /* console.log('professional table id:', row.id);
    this.professionalDataService.selectedId = row.id;
    this.professionalDataService.selectedDni = row.dni;
    this.professionalDataService.selectedCuil = row.cuil;
    this.professionalDataService.selectedNombre = row.nombre;
    this.professionalDataService.selectedApellido = row.apellido;
    this.professionalDataService.selectedProfesion = row.profesion;
    this.professionalDataService.dataUpdated.emit();
    this.dialogService.closeDialog();
 */
    
  }

  cancel() {
    this.dialogRef.close();
  }
}
