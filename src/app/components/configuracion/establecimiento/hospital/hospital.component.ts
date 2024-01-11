import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Hospital } from 'src/app/models/Hospital';
import { HospitalService } from 'src/app/services/hospital.service';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataSharingService } from 'src/app/services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { HospitalDetailComponent } from '../hospital-detail/hospital-detail.component';
import { HospitalEditComponent } from '../hospital-edit/hospital-edit.component';
import { HospitalNewComponent } from '../hospital-new/hospital-new.component';


export interface UserData {
  id: number;
  domicilio: string;
  estado: number;
  idLocalidad: number;
  idRegion: number;
  nombre: string;
  observacion: string;
  telefono: number;
  esCabecera: number;
  nivelComplejidad: number;

}


@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css']
})

export class HospitalComponent implements OnInit, AfterViewInit {

  hospital: Hospital[] = [];
  displayedColumns: string[] = ['id', 'domicilio', 'estado', 'idLocalidad', 'idRegion', 'nombre', 'telefono', 'esCabecera', 'nivelComplejidad', 'actions'];
  dataSource: MatTableDataSource<UserData>;
  suscription?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private hospitalService: HospitalService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dialogNew: MatDialog,
    public dialogEdit: MatDialog,
    public dialogDetail: MatDialog,
    private http: HttpClient,
    private paginatorLabels: MatPaginatorIntl,
    private dataSharingService: DataSharingService,
    private router: Router,
    ) {
    paginatorLabels.itemsPerPageLabel = 'Items por pagina';
    paginatorLabels.firstPageLabel = 'Primera Pagina';
    paginatorLabels.nextPageLabel = 'Siguiente';
    paginatorLabels.previousPageLabel = 'Anterior';
      this.dataSource = new MatTableDataSource<UserData>([]);
    }

  ngOnInit() {
    this.cargarHospital();

    this.suscription = this.hospitalService.refresh$.subscribe(() => {
      this.cargarHospital();
    })
  }

  ngOnDestroy(): void{
    this.suscription?.unsubscribe();
    console.log('Observable cerrado');
  }

  get<T>(arg0: any) {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarHospital(): void {
    this.hospitalService.lista().subscribe(
      (data: Hospital[]) => {
        const userDataArray: UserData[] = data.map(hospital => ({
          id: hospital.id || 0,
          domicilio: hospital.domicilio || '',
          estado: hospital.estado || 0,
          idLocalidad: hospital.localidad.id !== undefined ? hospital.localidad.id : 0,
          idRegion: hospital.region.id !== undefined ? hospital.region.id : 0,
          nombre: hospital.nombre || '',
          observacion: hospital.observacion || '',
          telefono: hospital.telefono || 0,
          esCabecera: hospital.esCabecera || 0,
          nivelComplejidad: hospital.nivelComplejidad || 0,
        }));

        this.dataSource.data = userDataArray;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(HospitalComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  borrar(id: number, nombre: string) {
    this.dialog
    .open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + nombre,
        title: 'Eliminar',
      },
    })
    .afterClosed()
    .subscribe((confirm: Boolean) => {
      if (confirm) {

    this.hospitalService.delete(id).subscribe(
      data=> {
        this.toastr.success('Ministerio eliminado', 'OK', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
        this.cargarHospital();
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
      }
    );
  } else {
    this.dialog.closeAll();
  }
});
  }

  addNewHospital() {
    this.dialogNew.open(HospitalNewComponent, {
      width: '600px',
      disableClose: true,
    });

  }

  addDetailHospital(id: number) {
    const dialogDetail = this.dialog.open(HospitalDetailComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogDetail.afterClosed().subscribe((result) => {
      console.log("linea 152: "+this.dataSharingService.getHospitalFormData());
      this.dataSource.data.push(this.dataSharingService.getHospitalFormData());
      console.log("id recibido: "+this.dataSharingService.getHospitalId());
    });
  }


  addEditHospital(id: number) {
    const dialogEdit = this.dialog.open(HospitalEditComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogEdit.afterClosed().subscribe((result) => {
      console.log("linea 167: "+this.dataSharingService.getHospitalFormData());
      this.dataSource.data.push(this.dataSharingService.getHospitalFormData());
      console.log("id recibido: "+this.dataSharingService.getHospitalId());
    });
  }

}
