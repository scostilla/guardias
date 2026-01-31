import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { LegajoDetailComponent } from '../legajo-detail/legajo-detail.component';

export type LegajoListDialogData = {
  legajos: Legajo[];
  nombreCompleto?: string;
  titulo?: string;
  fromAsistencial?: boolean;
  fromNoAsistencial?: boolean;
};

@Component({
  selector: 'app-legajo-list-dialog',
  templateUrl: './legajo-list-dialog.component.html',
  styleUrls: ['./legajo-list-dialog.component.css'],
})
export class LegajoListDialogComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Legajo>([]);

  constructor(
    private dialogRef: MatDialogRef<LegajoListDialogComponent>,
    private dialog: MatDialog,
    private legajoService: LegajoService,
    @Inject(MAT_DIALOG_DATA) public data: LegajoListDialogData
  ) {}

  ngOnInit(): void {
    const fromAsistencial = !!this.data?.fromAsistencial;
    const fromNoAsistencial = !!this.data?.fromNoAsistencial;

    if (fromAsistencial) {
      this.displayedColumns = ['esAutoridad', 'profesion', 'tipoGuardias', 'fechaInicio', 'fechaFinal', 'motivoModificacion', 'acciones'];
    } else if (fromNoAsistencial) {
      this.displayedColumns = ['esAutoridad', 'profesion', 'udo', 'fechaInicio', 'fechaFinal', 'motivoModificacion', 'acciones'];
    } else {
      this.displayedColumns = ['esAutoridad', 'profesion', 'fechaInicio', 'fechaFinal', 'motivoModificacion', 'acciones'];
    }

    this.dataSource = new MatTableDataSource<Legajo>(this.data?.legajos ?? []);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  close(): void {
    this.dialogRef.close();
  }

  getFechaFinal(legajo: Legajo): any {
    return (legajo as any).fechaFinal ?? null;
  }

  getMotivoModificacion(legajo: Legajo): string {
    const value = (legajo as any).motivoModificacion;
    return value ? String(value) : '';
  }

  openDetail(legajo: Legajo): void {
    this.legajoService.getById(legajo.id!).subscribe(
      (legajoActualizado) => {
        this.dialog.open(LegajoDetailComponent, {
          width: '600px',
          data: legajoActualizado,
        });
      },
      () => {
        this.dialog.open(LegajoDetailComponent, {
          width: '600px',
          data: legajo,
        });
      }
    );
  }

  accentFilter(input: string): string {
    const acentos = 'ÁÉÍÓÚáéíóú';
    const original = 'AEIOUaeiou';
    let output = '';
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    this.dataSource.filterPredicate = (data: Legajo, filter: string) => {
      const profesion = data.profesion ? data.profesion.nombre.toString() : '';
      const fechaInicio = data.fechaInicio ? data.fechaInicio.toISOString().toLowerCase() : '';
      const fechaFinal = (data as any).fechaFinal ? new Date((data as any).fechaFinal).toISOString().toLowerCase() : '';
      const motivoModificacion = (data as any).motivoModificacion ? String((data as any).motivoModificacion).toLowerCase() : '';

      return (
        this.accentFilter(profesion).includes(this.accentFilter(filter)) ||
        this.accentFilter(fechaInicio).includes(this.accentFilter(filter)) ||
        this.accentFilter(fechaFinal).includes(this.accentFilter(filter)) ||
        this.accentFilter(motivoModificacion).includes(this.accentFilter(filter))
      );
    };
  }
}
