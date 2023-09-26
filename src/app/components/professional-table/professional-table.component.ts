import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { Profesional } from 'src/app/models/profesional';
import { ProfesionalService } from 'src/app/services/Servicio/profesional.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NavigationExtras, Route, Router, RouterModule } from '@angular/router';
import { DialogServiceService } from 'src/app/services/DialogService/dialog-service.service';
import { ProfessionalDataServiceService } from 'src/app/services/ProfessionalDataService/professional-data-service.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ProfesionalTempService } from 'src/app/services/ProfesionalTemp/profesional-temp.service';
import { FormularioRegDiarioComponent } from '../formulario-reg-diario/formulario-reg-diario.component';

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
    RouterModule,
  ],
})
export class ProfessionalTableComponent implements OnInit {

  
  dataSource: MatTableDataSource<Profesional>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  profesionales: Profesional[] = [];
  //para el filtro
  filtro:string='';


  
  constructor(
    private router: Router,
    private profesionalTemp: ProfesionalTempService,
    //private formularioRegDiario: FormularioRegDiarioComponent,
    private http: HttpClient,
    private profesionalService: ProfesionalService,
    private professionalDataService: ProfessionalDataServiceService,
    private dialogService: DialogServiceService,

    public dialogRef: MatDialogRef<ProfessionalTableComponent>,
    
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
    this.profesionalTemp.miVariable$.next(true);
    
  }

  seleccionar(id:any){
    //this.router.navigateByUrl('regDiario/');
    //this.profesionalTemp.setId(id);
    console.log("########### id: " + id);
    //this.formularioRegDiario.cargarProfesional(id);
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
  }

  cancel() {
    this.dialogRef.close();
  }

 /*  filtrar(event: Event){
    const filtro = (event.target as HTMLInputElement).value;
    this.profesionales.filter = filtro.trim().toLowerCase();
  } */
  

}
/* import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Profesional } from 'src/app/models/profesional';
import { ProfesionalService } from 'src/app/services/Servicio/profesional.service';

@Component({
  selector: 'app-professional-table',
  templateUrl: './professional-table.component.html',
  styleUrls: ['./professional-table.component.css']
})
export class ProfessionalTableComponent implements OnInit {

  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'dni',
  ];
  profesionales: Profesional[] = [];
  //para el filtro
  dataSource:any;

  constructor(
    private profesionalService: ProfesionalService
   
    ) { }
  
   

  ngOnInit() {
    this.cargarProfesionales();
    console.log("Fabiana");
    //this.dataSource = new MatTableDataSource(this.profesionales);
  
    this.dataSource = new MatTableDataSource(this.profesionales);

    console.log("raquel");
    console.log(this.dataSource);
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

  filtrar(event: Event){
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }
  

} */



/* import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { DialogServiceService } from 'src/app/services/DialogService/dialog-service.service';
import { ProfessionalDataServiceService } from 'src/app/services/ProfessionalDataService/professional-data-service.service';

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
    private professionalDataService: ProfessionalDataServiceService, private dialogService: DialogServiceService
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
    console.log('professional table id:', row.id);
    this.professionalDataService.selectedId = row.id;
    this.professionalDataService.selectedCuil = row.cuil;
    this.professionalDataService.selectedNombre = row.nombre;
    this.professionalDataService.selectedApellido = row.apellido;
    this.professionalDataService.selectedProfesion = row.profesion;
    this.professionalDataService.dataUpdated.emit();
    this.dialogService.closeDialog();
  }
} */