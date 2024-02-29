import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Region } from 'src/app/models/Region';
import { RegionService } from 'src/app/services/region.service';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataSharingService } from 'src/app/services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { RegionDetailComponent } from '../region-detail/region-detail.component';
import { RegionEditComponent } from '../region-edit/region-edit.component';




@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})

export class RegionComponent  {


}
