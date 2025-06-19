import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

//Autenticación
import { AuthService } from 'src/app/services/login/auth.service';

//Services

//Models y Dto
import { Usuario } from 'src/app/models/login/Usuario';

//Componentes
import { UsuarioDetailComponent } from '../usuario-detail/usuario-detail.component';
import { UsuarioEditComponent } from '../usuario-edit/usuario-edit.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<Usuario>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<UsuarioDetailComponent>;
  displayedColumns: string[] = ['person', 'nombreUsuario', 'roles', 'acciones'];
  dataSource!: MatTableDataSource<Usuario>;
  suscription!: Subscription;
  usuarios: Usuario[] = [];

  nombresRoles: { [key: string]: string } = {
    'ROLE_ADMIN': 'Administrativo',
    'ROLE_USER': 'Usuario',
    'ROLE_DPH': 'DPH',
    'ROLE_SUPERUSER': 'Super usuario',
    'ROLE_AUTORIDAD': 'Autoridad'
  };

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private authService: AuthService,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.paginatorIntl.itemsPerPageLabel = "Registros por página";
    this.paginatorIntl.nextPageLabel = "Siguiente página";
    this.paginatorIntl.previousPageLabel = "Página anterior";
    this.paginatorIntl.firstPageLabel = "Primera página";
    this.paginatorIntl.lastPageLabel = "Última página";
    this.paginatorIntl.getRangeLabel = (page, size, length) => {
      const start = page * size + 1;
      const end = Math.min((page + 1) * size, length);
      return `${start} - ${end} de ${length}`;
    };
  }

  ngOnInit(): void {  
    this.listUsuarios();
    this.suscription = this.authService.refresh$.subscribe(() => {
      this.listUsuarios();
    })
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
    this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
      return this.accentFilter(data.person!.nombre.toLowerCase()).includes(this.accentFilter(filter)) ||
       this.accentFilter(data.person!.apellido.toLowerCase()).includes(this.accentFilter(filter));
       ;
    };
  }

  listUsuarios(): void {
    this.authService.list().subscribe(data => {
      data.forEach(usuario => {
        if (usuario.roles && usuario.roles.length > 0) {
          (usuario as any).rolesString = usuario.roles
            .map((rol: any) => this.nombresRoles[rol.rolNombre] || rol.rolNombre)
            .join(', ');  // Usando la propiedad dentro de la clase
        } else {
          (usuario as any).rolesString = ''; // En caso de que no haya roles
        }
      });

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

  openFormChanges(usuario?: Usuario): void {
    const esEdicion = usuario != null;
    const dialogRef = this.dialog.open(UsuarioEditComponent, {
      width: '600px',
      data: esEdicion ? usuario : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type === 'save') {
        this.toastr.success(esEdicion ? 'Usuario editado con éxito' : 'Usuario asignado con éxito', 'EXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        if (esEdicion) {
          const index = this.dataSource.data.findIndex(p => p.id === result.data.id);
          this.dataSource.data[index] = result.data;
        } else {
          this.dataSource.data.push(result.data);
        }
        this.dataSource._updateChangeSubscription();
      } else if (result && result.type === 'error') {
        this.toastr.error('Ocurrió un error al asignar o editar el Usuario', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      } else if (result && result.type === 'cancel') {
      }
    });
  }

  openDetail(usuario: Usuario): void {
    this.dialogRef = this.dialog.open(UsuarioDetailComponent, {
      width: '600px',
      data: usuario
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
  }

  /*deleteUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la baja de '+ usuario.person?.apellido +' ' + usuario.person?.nombre,
        title: 'Dar de baja',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.delete(usuario.id!).subscribe(data => {
          this.toastr.success('Usuario dada de baja con éxito', 'ELIMINADO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
  
          const index = this.dataSource.data.findIndex(p => p.id === usuario.id);
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        }, err => {
          this.toastr.error(err.message, 'Error, no se pudo eliminar la usuario', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        });
      }
    });
  }*/
}
