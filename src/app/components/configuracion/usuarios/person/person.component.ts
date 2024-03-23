import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';
import { PersonDetailComponent } from '../person-detail/person-detail.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { forkJoin } from 'rxjs';

type Action = 'Update' | 'Delete' | 'Detail';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'dni', 'email', 'tipo', 'actions'];
  dataSource = new MatTableDataSource();
  tipoFiltro: string = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private asistencialService: AsistencialService,
    private noAsistencialService: NoAsistencialService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadData();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = data.tipo.trim().toLowerCase();
      const filterStr = filter.trim().toLowerCase();
      
      if (filterStr === 'asistencial') {
        // Retorna true solo si el tipo es exactamente 'Asistencial'
        return dataStr === 'asistencial';
      } else if (filterStr === 'no asistencial') {
        // Retorna true solo si el tipo es exactamente 'No Asistencial'
        return dataStr === 'no asistencial';
      } else {
        // Si no hay filtro o es el filtro 'todos', muestra todos los registros
        return true;
      }
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  

  onTipoChange(newTipo: string) {
    this.tipoFiltro = newTipo;
    this.dataSource.filter = newTipo;
  }

  loadData() {
    forkJoin([
      this.asistencialService.list(),
      this.noAsistencialService.list()
    ]).subscribe(results => {
      // Combina los resultados y agrega el campo 'tipo'
      const combinedData = [
        ...results[0].map(item => ({ ...item, tipo: 'Asistencial' })),
        ...results[1].map(item => ({ ...item, tipo: 'No Asistencial' }))
      ];
      this.dataSource.data = combinedData;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  openDialog(action: Action, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(PersonDetailComponent, {
      width: '250px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Update') {
        // Call the update service
      } else if (result.event === 'Delete') {
        // Call the delete service
      }
    });
  }
}