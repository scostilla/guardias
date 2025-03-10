import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { ToastrService } from 'ngx-toastr';
import { Subscription } from "rxjs";
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { CargoService } from 'src/app/services/Configuracion/cargo.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { CargoDetailComponent } from '../cargo-detail/cargo-detail.component';
import { CargoEditComponent } from '../cargo-edit/cargo-edit.component';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.css']
})
export class CargoComponent implements OnInit, OnDestroy {

  @ViewChild( MatTable ) table!: MatTable<Cargo>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRefCargo!: MatDialogRef<CargoDetailComponent>;
  displayedColumns: string[] = ['nombre', 'descripcion', 'acciones'];
  dataSource!: MatTableDataSource<Cargo>;
  suscription!: Subscription;

  constructor(
    private cargoService: CargoService,
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
        return `${start} - ${end} de ${length}`;
    };
  }

  ngOnInit(): void {
    this.listCargo();

    this.suscription = this.cargoService.refresh$.subscribe(() => {
      this.listCargo();
    })
  }

  listCargo(): void {
    this.cargoService.list().subscribe(data => {
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

 openDetail(cargo: Cargo): void {
  this.dialogRefCargo = this.dialog.open(CargoDetailComponent, {
      width: '600px',
      data: cargo
  });
  this.dialogRefCargo.afterClosed().subscribe(() => {
    this.dialogRefCargo.close();
});
}

openFormChanges(cargo?: Cargo): void {
  const esEdicion = cargo != null;
  const dialogRefCargo = this.dialog.open(CargoEditComponent, {
      width: '600px',
      data: esEdicion ? cargo : null
  });

  dialogRefCargo.afterClosed().subscribe(result => {
      if (result) {
        if (result.type === 'save') {
          this.toastr.success( esEdicion? 'Cargo editado correctamente': 'Cargo creado correctamente', 'EXITO', {
          timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    if (esEdicion){
      const index = this.dataSource.data.findIndex(c1 => c1.id === result.data.id);
      if (index !== -1) {
        this.dataSource.data[index] = result.data;
      }
    }else {
      this.dataSource.data.push(result.data);
    }
    this.dataSource._updateChangeSubscription();
  } else if (result.type === 'error') {   
      this.toastr.error('Error al guardar el Cargo', 'ERROR', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
      });
  } else if ( result.type === 'cancel') {
  }
}
});
}

deleteCargo(cargo: Cargo): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      message: 'Confirma la eliminación de ' + cargo.nombre,
      title: 'Eliminar',
},
});

dialogRef.afterClosed().subscribe(result => {
  if (result) {
    this.cargoService.delete(cargo.id!).subscribe(() => {
      this.toastr.success('Cargo eliminado correctamente', 'ELIMINADO', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
    });
    const index = this.dataSource.data.findIndex(c1 => c1.id === cargo.id);
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
  }, err => {
    this.toastr.error(err.message,'Error al eliminar el Cargo', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
  });
});
  }
});
}

}
