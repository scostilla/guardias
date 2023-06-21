import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Professional } from 'src/app/interfaces/professinal';
import { ProfessionalAbmComponent } from '../professional-abm/professional-abm.component';

const listProfessionals: Professional[] = [
  {id: 1, cuil:'20-30442371-5',dni:30442371, name:'sebastian', lastName:'costilla', profession:'APU'},
  {id: 2, cuil:'20-3214653-5',dni:3214653, name:'rodrigo', lastName:'rodriguez', profession:'medico'},
  {id: 3, cuil:'20-9638524-5',dni:9638524, name:'javier', lastName:'capobianco', profession:'ing'},
  {id: 3, cuil:'20-75395145-5',dni:75395145, name:'paula', lastName:'costilla capobianco', profession:'veterinario'},
];


@Component({
  selector: 'app-professional-list',
  templateUrl: './professional-list.component.html',
  styleUrls: ['./professional-list.component.css']
})
export class ProfessionalListComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = ['cuil', 'name', 'lastName', 'dni','profession', 'actions'];
  dataSource: MatTableDataSource<Professional>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog){
    this.dataSource = new MatTableDataSource(listProfessionals);
  }

  ngOnInit():void {}

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

  addEditProfessional(){
    const dialogRef = this.dialog.open(ProfessionalAbmComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

}
