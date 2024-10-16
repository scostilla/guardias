import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { ToastrService } from 'ngx-toastr';
import { Subscription } from "rxjs";
import { TipoLicencia } from "src/app/models/Configuracion/TipoLicencia";
import { TipoLicenciaService } from "src/app/services/Configuracion/tipoLicencia.service";
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { TipoLicenciaDetailComponent } from "../tipo-licencia-detail/tipo-licencia-detail.component";
import { TipoLicenciaEditComponent } from "../tipo-licencia-edit/tipo-licencia-edit.component";


@Component({
    selector: 'app-tipo-licencia',
    templateUrl: './tipo-licencia.component.html',
    styleUrls: ['./tipo-licencia.component.css']

})
export class TipoLicenciaComponent implements OnInit, OnDestroy {
    
    @ViewChild( MatTable ) table!: MatTable<TipoLicencia>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dialogRefTipoLicencia!: MatDialogRef<TipoLicenciaDetailComponent>;
    displayedColumns: string[] = ['nombre', 'ley', 'acciones'];
    dataSource!: MatTableDataSource<TipoLicencia>;
    suscription!: Subscription;

    constructor(
        private tipoLicenciaService: TipoLicenciaService,
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
        this.listTipoLicencia();

        this.suscription = this.tipoLicenciaService.refresh$.subscribe(() => {
            this.listTipoLicencia();
        })
        
    }

    listTipoLicencia(): void {
        this.tipoLicenciaService.list().subscribe(data => {
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

    openDetail(tipoLicencia: TipoLicencia): void {
        this.dialogRefTipoLicencia = this.dialog.open(TipoLicenciaDetailComponent, {
            width: '600px',
            data: tipoLicencia
        });
        this.dialogRefTipoLicencia.afterClosed().subscribe(() => {
            this.dialogRefTipoLicencia.close();
    });
}
openFormChanges(tipoLicencia?: TipoLicencia): void {
    const esEdicion = tipoLicencia != null;
    const dialogRefTipoLicencia = this.dialog.open(TipoLicenciaEditComponent, {
        width: '600px',
        data: esEdicion ? tipoLicencia : null
    });

    dialogRefTipoLicencia.afterClosed().subscribe(result => {
        if (result) {
            if (result.type === 'save') {
                this.toastr.success( esEdicion? 'Tipo Licencia editado correctamente': 'Tipo Licencia creado correctamente', 'EXITO', {
                timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });

          if (esEdicion) {
            const index = this.dataSource.data.findIndex(tl => tl.id === result.data.id);
            if (index !== -1) {
              this.dataSource.data[index] = result.data;
            }
          }else {
            this.dataSource.data.push(result.data);
          }
          this.dataSource._updateChangeSubscription();
        } else if (result.type === 'error') {   
            this.toastr.error('Error al guardar Tipo Licencia', 'ERROR', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
            });
        } else if ( result.type === 'cancel') {
        }
    }
});
}

deleteTipoLicencia(tipoLicencia: TipoLicencia): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
            message: 'Confirma la eliminación de ' + tipoLicencia.nombre,
            title: 'Eliminar',
},
});

dialogRef.afterClosed().subscribe(result => {
    if (result) {
        this.tipoLicenciaService.delete(tipoLicencia.id!).subscribe(data => {
            this.toastr.success('Tipo Licencia eliminado con éxito', 'ELIMINADO', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
            });
            const index = this.dataSource.data.findIndex(tl => tl.id === tipoLicencia.id);
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription();
        }, err => {
            this.toastr.error(err.message, 'Error al eliminar Tipo Licencia', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
            });
        });
    }
});
}
}
       