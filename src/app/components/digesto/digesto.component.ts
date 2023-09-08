import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserData } from '../professional-list/professional-list.component';

export interface PeriodicElement {
    guardia: string;
    cat: string;
    position: number;
    act: string;
    detalle: string;
    ver: string;
}

@Component({
  selector: 'app-digesto',
  templateUrl: './digesto.component.html',
  styleUrls: ['./digesto.component.css']
})

export class DigestoComponent {
  displayedColumns: string[] = ['tipo', 'posicion', 'categoria', 'fecha', 'detalle', 'url'];
  dataSource: MatTableDataSource<UserData>;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource<UserData>([]);
  }

  ngOnInit() {
    this.http
      .get<UserData[]>('../../../assets/jsonFiles/digesto.json')
      .subscribe((data) => {
        this.dataSource.data = data;
        console.log(this.dataSource.data);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
