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



@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css']
})

export class HospitalComponent {

}