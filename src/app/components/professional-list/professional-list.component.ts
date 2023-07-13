import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProfessionalAbmComponent } from '../professional-abm/professional-abm.component';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatPaginatorIntl } from '@angular/material/paginator';


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

  constructor(private http: HttpClient, public dialog: MatDialog, private paginatorLabels: MatPaginatorIntl) {
    paginatorLabels.itemsPerPageLabel = "Items por pagina";
    paginatorLabels.firstPageLabel = "Primera Pagina";
    paginatorLabels.nextPageLabel = "Siguiente";
    paginatorLabels.previousPageLabel = "Anterior";
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
      console.log('The dialog addEditProfessional was closed');
    });
  }


//removeProfessional POR AHORA SOLO ELIMINA EL ELEMENTO EN LA VISTA
  removeProfessional(id: number, nombre:string,apellido:string){
    this.dialog
    .open(ConfirmDialogComponent, {
      data:{
        message: 'Confirma la eliminación de ' + nombre + ' ' + apellido,
        title: 'Eliminar',
      }
    })
    .afterClosed()
    .subscribe((confirm: Boolean) => {
      if (confirm) {
        console.log('remove Professional id: '+id);
    const index = this.dataSource.data.findIndex((element) => element.id === id);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
    }
      } else {
        this.dialog.closeAll();
      }
    });
  }

  //removeProfessional POR AHORA SOLO EDITA EL ELEMENTO EN LA VISTA
  editProfessional(id: number){
    console.log('edit Professional id: '+id);
  }

  detailProfessional(id: number){
    console.log('Details Professional id: '+id);
  }

}
