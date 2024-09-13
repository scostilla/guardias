import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { HospitalEditComponent } from '../hospital-edit/hospital-edit.component';
import { HospitalDetailComponent } from '../hospital-detail/hospital-detail.component'; 

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css']
})

export class HospitalComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<Hospital>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<HospitalDetailComponent>;
  displayedColumns: string[] = ['nombre', 'domicilio', 'localidad', 'acciones'];
  dataSource!: MatTableDataSource<Hospital>;
  suscription!: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private paginatorIntl: MatPaginatorIntl
  ) { 
    this.paginatorIntl.itemsPerPageLabel = "Registros por página";
    this.paginatorIntl.nextPageLabel = "Siguiente";
    this.paginatorIntl.previousPageLabel = "Anterior";
    this.paginatorIntl.firstPageLabel = "Primera página";
    this.paginatorIntl.lastPageLabel = "Última página";
    this.paginatorIntl.getRangeLabel = (page, size, length) => {
      const start = page * size + 1;
      const end = Math.min((page + 1) * size, length);
      return `${start} - ${end} de ${length}`; };
  }

  ngOnInit(): void {
    this.listHospital();

    this.suscription = this.hospitalService.refresh$.subscribe(() => {
      this.listHospital();
    })

  }

  listHospital(): void {
    this.hospitalService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
      this.suscription?.unsubscribe();
  }

  accentFilter(input: string): string {
    const acentos = "ÁÉÍÓÚáéíóú";
    const original = "AEIOUaeiou";
    let output = "";
    for (let i = 0; i < input.length; i++) {
      const index = acentos.indexOf(input[i]);
      if (index >= 0) {
        output += original[index];
      } else {
        output += input[i];
      }
    }
    return output;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Hospital, filter: string) => {
      return this.accentFilter(data.nombre.toLowerCase()).includes(this.accentFilter(filter)) ||
       this.accentFilter(data.localidad.nombre.toLowerCase()).includes(this.accentFilter(filter));
    };
  }

  openFormChanges(hospital?: Hospital): void {
    const esEdicion = hospital != null;
    const dialogRef = this.dialog.open(HospitalEditComponent, {
      width: '600px',
      data: esEdicion ? hospital : null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.type === 'save') {
          this.toastr.success(esEdicion ? 'Hospital editado con éxito' : 'Hospital creado con éxito', 'EXITO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
  
          if (esEdicion) {
            const index = this.dataSource.data.findIndex(p => p.id === result.data.id);
            if (index !== -1) {
              this.dataSource.data[index] = result.data;
            }
          } else {
            this.dataSource.data.push(result.data);
          }
          this.dataSource._updateChangeSubscription();
        } else if (result.type === 'error') {
          this.toastr.error('Ocurrió un error al crear o editar el hospital', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        } else if (result.type === 'cancel') {
        }
      }
    });
  }
  

  openDetail(hospital: Hospital): void {
    this.dialogRef = this.dialog.open(HospitalDetailComponent, { 
      width: '600px',
      data: hospital
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }

  deleteHospital(hospital: Hospital): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + hospital.nombre,
        title: 'Eliminar',
      },
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.hospitalService.delete(hospital.id!).subscribe(data => {
        this.toastr.success('Hospital eliminado con éxito', 'ELIMINADO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        const index = this.dataSource.data.findIndex(p => p.id === hospital.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }, err => {
        this.toastr.error(err.message, 'Error, no se pudo eliminar el hospital', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      });
    }
  });
}
}