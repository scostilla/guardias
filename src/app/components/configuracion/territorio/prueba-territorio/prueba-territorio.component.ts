import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Profesion } from 'src/app/models/Profesion';
import { ProfesionService } from 'src/app/services/profesion.service';
import { PruebaFormComponent } from '../prueba-form/prueba-form.component';
import { PruebaDetailComponent } from '../prueba-detail/prueba-detail.component'; 

@Component({
  selector: 'app-prueba-territorio',
  templateUrl: './prueba-territorio.component.html',
  styleUrls: ['./prueba-territorio.component.css']
})
export class PruebaTerritorioComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<PruebaDetailComponent>;
  displayedColumns: string[] = ['id', 'nombre', 'asistencial', 'acciones'];
  dataSource!: MatTableDataSource<Profesion>;

  constructor(
    private profesionService: ProfesionService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.profesionService.lista().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirFormulario(profesion?: Profesion): void {
    const esEdicion = profesion != null;
    const dialogRef = this.dialog.open(PruebaFormComponent, {
      data: esEdicion ? profesion : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alert(esEdicion ? 'Profesión editada con éxito' : 'Profesión creada con éxito');
        if (esEdicion) {
          const index = this.dataSource.data.findIndex(p => p.id === result.id);
          this.dataSource.data[index] = result;
        } else {
          this.dataSource.data.push(result);
        }
        this.dataSource._updateChangeSubscription();
      }
    });
  }

  abrirDetalle(profesion: Profesion): void {
    this.dialogRef = this.dialog.open(PruebaDetailComponent, { 
      data: profesion
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }

  eliminarProfesion(profesion: Profesion): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta profesión?')) {
      this.profesionService.delete(profesion.id!).subscribe(data => {
        alert('Profesión eliminada con éxito');

        const index = this.dataSource.data.findIndex(p => p.id === profesion.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      });
    }
  }

}