import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Notificacion } from 'src/app/models/Notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NotificacionEditComponent } from '../notificacion/notificacion-edit/notificacion-edit.component';
import { NotificacionDetailComponent } from './notificacion-detail/notificacion-detail.component';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: [
    './notificacion.component.css',
    '../digesto/digesto.component.css' // reutiliza estilos de Digesto (triángulos guardia-act / guardia-pas)
  ]
})

export class NotificacionComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('futureDialog') futureDialogTpl!: TemplateRef<any>;

  dialogRef!: MatDialogRef<NotificacionDetailComponent>;
  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<Notificacion>;
  suscription!: Subscription;
  
  private readonly API_BASE = environment.apiUrl;
  private allNotificaciones: Notificacion[] = [];
  showingFuture: boolean = false;
  private futureDialogRef?: MatDialogRef<any>;     // <-- NUEVO
  futureData: Notificacion[] = [];                 // <-- NUEVO
  
  @Input() title: string = 'NOTIFICACIONES';

  // Nuevo: helpers para adaptar UI según contexto (DIGESTO vs NOTIFICACION)
  public get isDigesto(): boolean {
    return !!(this.title && String(this.title).trim().toUpperCase() === 'DIGESTO');
  }
  public get addLabel(): string {
    return this.isDigesto ? 'Agregar Digesto' : 'Agregar notificación';
  }

  constructor(
    private notificacionService: NotificacionService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private paginatorIntl: MatPaginatorIntl,
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

  ngOnInit() {
    // Determinar columnas según contexto (si es DIGESTO añadimos la columna 'guardia' al inicio)
    if (this.isDigesto) {
      this.displayedColumns = ['guardia', 'tipo', 'categoria', 'fechaNotificacion', 'detalle', 'url', 'acciones'];
    } else {
      this.displayedColumns = ['tipo', 'categoria', 'fechaNotificacion', 'detalle', 'url', 'acciones'];
    }
    this.listNotificacion();

    this.suscription = this.notificacionService.refresh$.subscribe(() => {
      this.listNotificacion();
    })
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

  // Helper: determina el tipo a pedir al backend a partir del título del wrapper
	private getTipoFromTitle(): string | null {
		if (!this.title) return null;
		const t = this.title.trim().toUpperCase();
		if (t === 'DIGESTO') return 'DIGESTO';
		// Normalizamos "NOTIFICACIONES" y variantes a NOTIFICACION (enum)
		if (t === 'NOTIFICACIONES' || t === 'NOTIFICACION') return 'NOTIFICACION';
		return null;
	}

  listNotificacion(): void {
    const tipo = this.getTipoFromTitle();
    const obs = tipo
      ? this.notificacionService.listByTipo(tipo)
      : this.notificacionService.list();

    obs.subscribe(data => {
      this.allNotificaciones = data || [];
      // Vista general: excluir futuras
      const generales = this.filterGeneral(this.allNotificaciones);
      this.dataSource = new MatTableDataSource(generales);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.showingFuture = false;
    });
  }

  // Alternar entre lista futura y general (queda por si lo necesitas)
  toggleFutureList(): void {
    if (this.showingFuture) {
      // Volver a general
      const generales = this.filterGeneral(this.allNotificaciones);
      this.dataSource.data = generales;
      this.showingFuture = false;
      this.toastr.info('Vista general', '', { timeOut: 2000 });
    } else {
      // Mostrar solo futuras
      const futuras = this.filterFuturas(this.allNotificaciones);
      this.dataSource.data = futuras;
      this.showingFuture = true;
      this.toastr.info('Notificaciones a publicar (futuras)', '', { timeOut: 2000 });
    }
    this.dataSource._updateChangeSubscription();
  }

  // NUEVO: abrir pop-up con la lista de notificaciones futuras
  openFutureDialog(): void {
    const futuras = this.filterFuturas(this.allNotificaciones);
    if (!futuras || futuras.length === 0) {
      this.toastr.info('No hay notificaciones futuras para mostrar', '', { timeOut: 2500 });
      return;
    }
    this.futureData = futuras; // <-- usar propiedad para data reactiva
    this.futureDialogRef = this.dialog.open(this.futureDialogTpl, {
      width: '95vw',
      maxWidth: '60vw',
      maxHeight: '90vh',
      data: null // <-- no dependemos de data para refrescar
    });
    this.futureDialogRef.afterClosed().subscribe(() => {
      this.futureDialogRef = undefined;
    });
  }

  // Helpers de fecha
  private startOfDay(d: Date): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  private parseFecha(value: any): Date | null {
    if (!value) return null;
    // Si viene en formato 'YYYY-MM-DD' parsear partes y construir Date local (evita shift UTC)
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, day] = value.split('-').map(Number);
      if (!isNaN(y) && !isNaN(m) && !isNaN(day)) {
        return this.startOfDay(new Date(y, m - 1, day));
      }
    }
    if (value instanceof Date) return this.startOfDay(value);
    // Fallback: intentar crear Date desde string/ISO y normalizar
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : this.startOfDay(d);
  }
  private isFuture(fecha: any): boolean {
    const d = this.parseFecha(fecha);
    if (!d) return false;
    const hoy = this.startOfDay(new Date());
    return d > hoy;
  }
  private filterGeneral(data: Notificacion[]): Notificacion[] {
    // General: todo lo que NO sea futuro (hoy o pasado)
    return (data || []).filter(n => !this.isFuture(n.fechaNotificacion));
  }
  private filterFuturas(data: Notificacion[]): Notificacion[] {
    // Futuras: estrictamente mayor a hoy
    return (data || []).filter(n => this.isFuture(n.fechaNotificacion));
  }

  private accentFilter(input: string): string {
    if (!input) return '';
    const acentos = 'ÁÉÍÓÚÜÑáéíóúüñ';
    const original = 'AEIOUUNaeiouun';
    let out = '';
    for (const ch of input) {
      const idx = acentos.indexOf(ch);
      out += idx >= 0 ? original[idx] : ch;
    }
    return out;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Notificacion, filter: string) => {
      return this.accentFilter(data.tipo.toLowerCase()).includes(this.accentFilter(filter)) || 
      this.accentFilter(data.detalle.toLowerCase()).includes(this.accentFilter(filter)) || 
      this.accentFilter(data.categoria.toLowerCase()).includes(this.accentFilter(filter));
    };
  } 

  openFormChanges(notificacion?: Notificacion): void {
    const esEdicion = !!notificacion;
    // Pasamos objeto con payload + contexto para que el edit adapte textos
    const payload = { notificacion: esEdicion ? notificacion : null, context: this.title || 'NOTIFICACION' };
    const dialogRef = this.dialog.open(NotificacionEditComponent, {
      width: '600px',
      data: payload
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) return;

      const upsert = (n: Notificacion) => {
        // Buscar índice en allNotificaciones
        const j = this.allNotificaciones.findIndex(x => x.id === n.id);
        if (j >= 0) {
          // Merge seguro: preservar fecha original si no viene en 'n'
          const existente = this.allNotificaciones[j];
          const fechaPreservada = (n.fechaNotificacion === undefined || n.fechaNotificacion === null || n.fechaNotificacion === '')
            ? existente.fechaNotificacion
            : n.fechaNotificacion;
          const actualizado: Notificacion = { ...existente, ...n, fechaNotificacion: fechaPreservada };
          this.allNotificaciones[j] = actualizado;
        } else {
          // Nuevo: asegurar que trae fecha (si no, dejar n tal cual)
          this.allNotificaciones.push(n);
        }
      };

      if (Array.isArray(result)) {
        result.forEach(r => upsert(r));
        this.toastr.success(
          esEdicion ? 'Notificación actualizada' : `${result.length} notificaciones creadas`,
          'Éxito',
          { timeOut: 4000, positionClass: 'toast-top-center', progressBar: true }
        );
      } else if (result && typeof result === 'object') {
        upsert(result);
        this.toastr.success(
          esEdicion ? 'Notificación actualizada' : 'Notificación creada',
          'Éxito',
          { timeOut: 4000, positionClass: 'toast-top-center', progressBar: true }
        );
      } else {
        this.toastr.error('Respuesta desconocida del servidor', 'Error');
      }

      // Recalcular vistas desde la fuente canonical allNotificaciones
      this.dataSource.data = this.filterGeneral(this.allNotificaciones);
      this.dataSource._updateChangeSubscription();

      // Si el pop-up de futuras está abierto, recalcular su data (se actualizará automáticamente)
      if (this.futureDialogRef) {
        this.futureData = this.filterFuturas(this.allNotificaciones);
      }
    });
  }

  openDetail(notificacion: Notificacion): void {
    this.dialogRef = this.dialog.open(NotificacionDetailComponent, { 
      width: '600px',
      data: notificacion
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }

  deleteNotificacion(notificacion: Notificacion): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: 'Confirma la eliminación ',
          title: 'Eliminar',
        },
      });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificacionService.delete(notificacion.id!).subscribe(data => {
          this.toastr.success('Notificacion eliminada con éxito', 'ELIMINADA', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
  
          const index = this.dataSource.data.findIndex(p => p.id === notificacion.id);
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        }, err => {
          this.toastr.error(err.message, 'Error, no se pudo eliminar la notificacion', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        });
      }
    });
  }

  // Formatea el nombre del archivo: quita _<timestamp> y reemplaza _ por espacio
  displayFileName(url?: string): string {
    if (!url) return '';
    const file = (url.split('/').pop() || url);
    const dot = file.lastIndexOf('.');
    const ext = dot >= 0 ? file.substring(dot) : '';
    let base = dot >= 0 ? file.substring(0, dot) : file;
    base = base.replace(/_\d+$/, '').replace(/_/g, ' ').trim();
    return base + ext;
  }

  openPdf(n: Notificacion): void {
    const url = this.getFullUrl(n.url);
    if (!url) {
      this.toastr.info('Sin PDF asociado');
      return;
    }
    window.open(url, '_blank');
  }

  private getFullUrl(url?: string): string | null {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    return url.startsWith('/') ? `${this.API_BASE}${url}` : `${this.API_BASE}/${url}`;
  }

}