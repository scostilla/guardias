import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './components/shared/shared.module';

//Components
import { NgFor } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DailyScheduleComponent } from './components/daily-schedule/daily-schedule.component';
import { DdjjExtraComponent } from './components/ddjj-extra/ddjj-extra.component';
import { DistHorariaComponent } from './components/dist-horaria/dist-horaria.component';
import { FooterComponent } from './components/footer/footer.component';
import { GuardiaActivaComponent } from './components/guardia-activa/guardia-activa.component';
import { GuardiaPasivaComponent } from './components/guardia-pasiva/guardia-pasiva.component';
import { GuardiasViewComponent } from './components/guardias-view/guardias-view.component';
import { HeaderComponent } from './components/header/header.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NovedadesFormComponent } from './components/novedades-form/novedades-form.component';
import { PopupComponent } from './components/popup/popup.component';
import { ProfessionalAbmComponent } from './components/professional-abm/professional-abm.component';
import { ProfessionalFormComponent } from './components/professional-form/professional-form.component';
import { ProfessionalListComponent } from './components/professional-list/professional-list.component';
import { ProfessionalNewsComponent } from './components/professional-news/professional-news.component';
import { ProfessionalTableComponent } from './components/professional-table/professional-table.component';
import { RegDiarioComponent } from './components/reg-diario/reg-diario.component';
import { RegistroActividadesComponent } from './components/registro-actividades/registro-actividades.component';
import { RegistroDiarioComponent } from './components/registro-diario/registro-diario.component';
import { ScheduleCardComponent } from './components/schedule-card/schedule-card.component';
import { ScheduleDistributionComponent } from './components/schedule-distribution/schedule-distribution.component';
import { SearchProfessionalComponent } from './components/search-professional/search-professional.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { ProfessionalDataServiceService } from './services/ProfessionalDataService/Professional-data-service.service';


import { DdjjCargoyagrupComponent } from './components/ddjj-cargoyagrup/ddjj-cargoyagrup.component';
import { DdjjContrafacturaComponent } from './components/ddjj-contrafactura/ddjj-contrafactura.component';
import { ProfessionalDetailComponent } from './components/professional-detail/professional-detail.component';



//Date Import
import localePy from '@angular/common/locales/es-PY';
import { ArrayFecComponent } from './components/array-fec/array-fec.component';
import { CronogramaDefMaternoComponent } from './components/cronograma-def-materno/cronograma-def-materno.component';
import { CronogramaDefSroqueComponent } from './components/cronograma-def-sroque/cronograma-def-sroque.component';
import { CronogramaDefComponent } from './components/cronograma-def/cronograma-def.component';
import { CronogramaDefinitivoComponent } from './components/cronograma-definitivo/cronograma-definitivo.component';
import { CronogramaFormAgregarComponent } from './components/cronograma-form-agregar/cronograma-form-agregar.component';
import { CronogramaPDefTotComponent } from './components/cronograma-p-def-tot/cronograma-p-def-tot.component';
import { CronogramaPDefComponent } from './components/cronograma-p-def/cronograma-p-def.component';
import { CronogramaPHosComponent } from './components/cronograma-p-hos/cronograma-p-hos.component';
import { CronogramaPComponent } from './components/cronograma-p/cronograma-p.component';
import { CronogramaRegComponent } from './components/cronograma-reg/cronograma-reg.component';
import { CronogramaTentativoComponent } from './components/cronograma-tentativo/cronograma-tentativo.component';
import { CronogramaComponent } from './components/cronograma/cronograma.component';
import { DdjjCargoyagrupTotComponent } from './components/ddjj-cargoyagrup-tot/ddjj-cargoyagrup-tot.component';
import { DdjjCargoyagrupTotalApComponent } from './components/ddjj-cargoyagrup-total-ap/ddjj-cargoyagrup-total-ap.component';
import { DdjjCargoyagrupTotalRecComponent } from './components/ddjj-cargoyagrup-total-rec/ddjj-cargoyagrup-total-rec.component';
import { DdjjContrafacturaTotApComponent } from './components/ddjj-contrafactura-tot-ap/ddjj-contrafactura-tot-ap.component';
import { DdjjContrafacturaTotRecComponent } from './components/ddjj-contrafactura-tot-rec/ddjj-contrafactura-tot-rec.component';
import { DdjjContrafacturaTotComponent } from './components/ddjj-contrafactura-tot/ddjj-contrafactura-tot.component';
import { DdjjExtraTotApComponent } from './components/ddjj-extra-tot-ap/ddjj-extra-tot-ap.component';
import { DdjjExtraTotRecComponent } from './components/ddjj-extra-tot-rec/ddjj-extra-tot-rec.component';
import { DdjjExtraTotComponent } from './components/ddjj-extra-tot/ddjj-extra-tot.component';
import { DdjjTentativoComponent } from './components/ddjj-tentativo/ddjj-tentativo.component';
import { DigestoComponent } from './components/digesto/digesto.component';
import { DisponibilidadComponent } from './components/disponibilidad/disponibilidad.component';
import { DistHorariaConsComponent } from './components/dist-horaria-cons/dist-horaria-cons.component';
import { DistHorariaGirasComponent } from './components/dist-horaria-giras/dist-horaria-giras.component';
import { DistHorariaGuardiaComponent } from './components/dist-horaria-guardia/dist-horaria-guardia.component';
import { DistHorariaOtrasComponent } from './components/dist-horaria-otras/dist-horaria-otras.component';
import { GuardiasViewPComponent } from './components/guardias-view-p/guardias-view-p.component';
import { HistorialComponent } from './components/historial/historial.component';
import { MonthTableComponent } from './components/month-table/month-table.component';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { PopupCalendarioDispComponent } from './components/popup-calendario-disp/popup-calendario-disp.component';
import { PopupCalendarioDisp2Component } from './components/popup-calendario-disp2/popup-calendario-disp2.component';
import { PopupCalendarioVacioComponent } from './components/popup-calendario-vacio/popup-calendario-vacio.component';
import { PopupCalendarioComponent } from './components/popup-calendario/popup-calendario.component';
import { PopupDdjjCfEditComponent } from './components/popup-ddjj-cf-edit/popup-ddjj-cf-edit.component';
import { PopupDdjjCfComponent } from './components/popup-ddjj-cf/popup-ddjj-cf.component';
import { PopupNovedadAgregarComponent } from './components/popup-novedad-agregar/popup-novedad-agregar.component';
import { ProfessionalDhHistComponent } from './components/professional-dh-hist/professional-dh-hist.component';
import { ProfessionalDhJunioComponent } from './components/professional-dh-junio/professional-dh-junio.component';
import { ProfessionalDhComponent } from './components/professional-dh/professional-dh.component';
import { ProfessionalFormDeletComponent } from './components/professional-form-delet/professional-form-delet.component';
import { ProfessionalFormEditComponent } from './components/professional-form-edit/professional-form-edit.component';
import { ProfessionalPlantillaDhComponent } from './components/professional-plantilla-dh/professional-plantilla-dh.component';
import { TablaComponent } from './components/tabla/tabla.component';


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
    CronogramaDefinitivoComponent,
    CronogramaTentativoComponent,
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
    NovedadesComponent,
    PopupNovedadAgregarComponent,
    CronogramaPComponent,
    CronogramaPDefComponent,
    CronogramaPHosComponent,
    GuardiasViewPComponent,
    ProfessionalDhComponent,
    PopupDdjjCfComponent,
    PopupDdjjCfEditComponent,
    CronogramaPDefTotComponent,
    DdjjTentativoComponent,
    DdjjCargoyagrupTotComponent,
    DdjjExtraTotComponent,
    DdjjContrafacturaTotComponent,
    DistHorariaGuardiaComponent,
    DistHorariaConsComponent,
    DistHorariaGirasComponent,
    DistHorariaOtrasComponent,
    ProfessionalDhHistComponent,
    ProfessionalDhJunioComponent,
    CronogramaFormAgregarComponent,
    ProfessionalFormEditComponent,
    CronogramaDefMaternoComponent,
    CronogramaDefSroqueComponent,
    DdjjCargoyagrupTotalApComponent,
    DdjjCargoyagrupTotalRecComponent,
    DdjjExtraTotRecComponent,
    DdjjExtraTotApComponent,
    DdjjContrafacturaTotApComponent,
    DdjjContrafacturaTotRecComponent,
    ProfessionalFormDeletComponent,
    ProfessionalPlantillaDhComponent,
    DdjjCargoyagrupTotalApComponent,
    DdjjCargoyagrupTotalRecComponent,
    DdjjContrafacturaTotApComponent,
    DdjjContrafacturaTotRecComponent,
    DdjjExtraTotApComponent,
    DdjjExtraTotRecComponent,
    ProfessionalDhHistComponent,
    ProfessionalDhJunioComponent,
    ProfessionalFormEditComponent,

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
    MatBadgeModule,
  ],
  providers: [
    ProfessionalDataServiceService,
    {provide: LOCALE_ID,useValue:'es'}
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
