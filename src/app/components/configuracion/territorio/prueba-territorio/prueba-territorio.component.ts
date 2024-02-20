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

  dialogRef!: MatDialogRef<PruebaDetailComponent>;

  // Referencia al paginador de la tabla
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Referencia a la ordenación de la tabla
  @ViewChild(MatSort) sort!: MatSort;

  // Columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['id', 'nombre', 'asistencial', 'acciones'];

  // Fuente de datos de la tabla
  dataSource!: MatTableDataSource<Profesion>;

  constructor(
    private profesionService: ProfesionService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Obtener la lista de profesiones del servicio y asignarla a la fuente de datos
    this.profesionService.lista().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  // Método para abrir el formulario de profesión en un diálogo modal
  abrirFormulario(profesion?: Profesion): void {
    // Si se recibe una profesión, significa que es una edición, sino es una creación
    const esEdicion = profesion != null;

    // Abrir un diálogo modal con el componente FormProfesionComponent
    // y pasarle la profesión como dato si es una edición
    const dialogRef = this.dialog.open(PruebaFormComponent, {
      data: esEdicion ? profesion : null
    });

    // Suscribirse al evento de cierre del diálogo
    dialogRef.afterClosed().subscribe(result => {
      // Si se recibió un resultado, significa que se guardó o actualizó la profesión
      if (result) {
        // Mostrar un mensaje de éxito según el caso
        alert(esEdicion ? 'Profesión editada con éxito' : 'Profesión creada con éxito');

        // Actualizar la tabla
        if (esEdicion) {
          // Si es una edición, buscar el índice de la profesión y reemplazarla
          const index = this.dataSource.data.findIndex(p => p.id === result.id);
          this.dataSource.data[index] = result;
        } else {
          // Si es una creación, agregar la profesión al final del arreglo
          this.dataSource.data.push(result);
        }
        // Actualizar el cambio en la fuente de datos
        this.dataSource._updateChangeSubscription();
      }
    });
  }

  // Método para abrir el detalle de la profesión en un diálogo modal
  abrirDetalle(profesion: Profesion): void {
    // Abrir un diálogo modal con el componente DetailProfesionComponent
    // y pasarle la profesión como dato
    this.dialogRef = this.dialog.open(PruebaDetailComponent, { // Asignar el resultado del método open a la propiedad dialogRef
      data: profesion
    });
    this.dialogRef.afterClosed().subscribe(() => {
      // Cerrar el diálogo
      this.dialogRef.close();
    });
    }

  // Método para eliminar una profesión existente
  eliminarProfesion(profesion: Profesion): void {
    // Pedir confirmación al usuario
    if (confirm('¿Estás seguro de que quieres eliminar esta profesión?')) {
      // Enviar el id de la profesión al servicio para eliminarla en el backend
      this.profesionService.delete(profesion.id!).subscribe(data => {
        // Mostrar un mensaje de éxito
        alert('Profesión eliminada con éxito');

        // Actualizar la tabla
        const index = this.dataSource.data.findIndex(p => p.id === profesion.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      });
    }
  }

}