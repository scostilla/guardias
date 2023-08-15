import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './components/shared/shared.module';

//Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfessionalFormComponent } from './components/professional-form/professional-form.component';
import { PopupComponent } from './components/popup/popup.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { SearchProfessionalComponent } from './components/search-professional/search-professional.component';
import { ProfessionalTableComponent } from './components/professional-table/professional-table.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { DailyScheduleComponent } from './components/daily-schedule/daily-schedule.component';
import { ScheduleCardComponent } from './components/schedule-card/schedule-card.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroDiarioComponent } from './components/registro-diario/registro-diario.component';
import { RegistroActividadesComponent } from './components/registro-actividades/registro-actividades.component';
import { ScheduleDistributionComponent } from './components/schedule-distribution/schedule-distribution.component';
import { ProfessionalNewsComponent } from './components/professional-news/professional-news.component';
import { ProfessionalAbmComponent } from './components/professional-abm/professional-abm.component';
import { ProfessionalDataServiceService } from './services/ProfessionalDataService/professional-data-service.service';
import { NovedadesFormComponent } from './components/novedades-form/novedades-form.component';
import { DistHorariaComponent } from './components/dist-horaria/dist-horaria.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ProfessionalListComponent } from './components/professional-list/professional-list.component';
import { GuardiasViewComponent } from './components/guardias-view/guardias-view.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { GuardiaActivaComponent } from './components/guardia-activa/guardia-activa.component';
import { GuardiaPasivaComponent } from './components/guardia-pasiva/guardia-pasiva.component';
import { RegDiarioComponent } from './components/reg-diario/reg-diario.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DdjjExtraComponent } from './components/ddjj-extra/ddjj-extra.component';
import {MatTableModule} from '@angular/material/table';
import {NgFor} from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


import { ProfessionalDetailComponent } from './components/professional-detail/professional-detail.component';
import { DdjjContrafacturaComponent } from './components/ddjj-contrafactura/ddjj-contrafactura.component';
import { DdjjCargoyagrupComponent } from './components/ddjj-cargoyagrup/ddjj-cargoyagrup.component';



//Date Import
import localePy from '@angular/common/locales/es-PY';
import { TablaComponent } from './components/tabla/tabla.component';
import { ArrayFecComponent } from './components/array-fec/array-fec.component';
import { MonthTableComponent } from './components/month-table/month-table.component';
import { PopupCalendarioComponent } from './components/popup-calendario/popup-calendario.component';
import { CronogramaComponent } from './components/cronograma/cronograma.component';
import { DigestoComponent } from './components/digesto/digesto.component';
import { HistorialComponent } from './components/historial/historial.component';
import { DisponibilidadComponent } from './components/disponibilidad/disponibilidad.component';
import { PopupCalendarioDispComponent } from './components/popup-calendario-disp/popup-calendario-disp.component';
import { CronogramaDefComponent } from './components/cronograma-def/cronograma-def.component';
import { PopupCalendarioVacioComponent } from './components/popup-calendario-vacio/popup-calendario-vacio.component';
import { CronogramaRegComponent } from './components/cronograma-reg/cronograma-reg.component';
import { PopupCalendarioDisp2Component } from './components/popup-calendario-disp2/popup-calendario-disp2.component';


registerLocaleData(localePy,'es');


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ProfessionalFormComponent,
    PopupComponent,
    CalendarComponent,
    TimePickerComponent,
    SearchProfessionalComponent,
    HomePageComponent,
    DailyScheduleComponent,
    ScheduleCardComponent,
    RegistroDiarioComponent,
    LoginComponent,
    RegistroDiarioComponent,
    RegistroActividadesComponent,
    ScheduleDistributionComponent,
    ProfessionalNewsComponent,
    ProfessionalAbmComponent,
    ProfessionalListComponent,
    NovedadesFormComponent,
    DistHorariaComponent,
    ConfirmDialogComponent,
    GuardiasViewComponent,
    NavBarComponent,
    GuardiaActivaComponent,
    GuardiaPasivaComponent,
    RegDiarioComponent,
    RegDiarioComponent,
    DdjjExtraComponent,
    ProfessionalDetailComponent,
    DdjjContrafacturaComponent,
    DdjjCargoyagrupComponent,
   /*  ApiComponent,  */
    TablaComponent,
    ArrayFecComponent,
    MonthTableComponent,
    PopupCalendarioComponent,
    CronogramaComponent,
    DigestoComponent,
    HistorialComponent,
    DisponibilidadComponent,
    PopupCalendarioDispComponent,
    CronogramaDefComponent,
    PopupCalendarioVacioComponent,
    CronogramaRegComponent,
    PopupCalendarioDisp2Component,
    
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ProfessionalTableComponent,
    NgxMatTimepickerModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatTableModule,
    NgFor,
    MatButtonToggleModule,
    DatePipe,
  ],
  providers: [
    ProfessionalDataServiceService,
    {provide: LOCALE_ID,useValue:'es'}
  ],
  
  bootstrap: [AppComponent],
})
export class AppModule {}
