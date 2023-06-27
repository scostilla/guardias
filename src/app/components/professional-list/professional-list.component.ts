import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProfessionalAbmComponent } from '../professional-abm/professional-abm.component';
import { HttpClient } from '@angular/common/http';

export interface UserData {
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
  displayedColumns: string[] = [
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

  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<UserData>([]);
  }

  ngOnInit() {
    this.http
      .get<UserData[]>('../../../assets/jsonFiles/profesionales.json')
      .subscribe((data) => {
        this.dataSource.data = data;
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

  addEditProfessional() {
    const dialogRef = this.dialog.open(ProfessionalAbmComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  removeProfessional(){
    console.log('remove professional');
  }

  editProfessional(nombre: string){
    console.log('edit Professional');
  }

}
