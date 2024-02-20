import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './components/shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';

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
import {MatBadgeModule} from '@angular/material/badge';


import { ProfessionalDetailComponent } from './components/professional-detail/professional-detail.component';
import { DdjjContrafacturaComponent } from './components/ddjj-contrafactura/ddjj-contrafactura.component';
import { DdjjCargoyagrupComponent } from './components/ddjj-cargoyagrup/ddjj-cargoyagrup.component';

//Toastr
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


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
import { NovedadesComponent } from './components/novedades/novedades.component';
import { PopupNovedadAgregarComponent } from './components/popup-novedad-agregar/popup-novedad-agregar.component';
import { CronogramaPComponent } from './components/cronograma-p/cronograma-p.component';
import { CronogramaPDefComponent } from './components/cronograma-p-def/cronograma-p-def.component';
import { CronogramaPHosComponent } from './components/cronograma-p-hos/cronograma-p-hos.component';
import { GuardiasViewPComponent } from './components/guardias-view-p/guardias-view-p.component';
import { ProfessionalDhComponent } from './components/professional-dh/professional-dh.component';
import { PopupDdjjCfComponent } from './components/popup-ddjj-cf/popup-ddjj-cf.component';
import { PopupDdjjCfEditComponent } from './components/popup-ddjj-cf-edit/popup-ddjj-cf-edit.component';
import { CronogramaPDefTotComponent } from './components/cronograma-p-def-tot/cronograma-p-def-tot.component';
import { DdjjTentativoComponent } from './components/ddjj-tentativo/ddjj-tentativo.component';
import { DdjjCargoyagrupTotComponent } from './components/ddjj-cargoyagrup-tot/ddjj-cargoyagrup-tot.component';
import { DdjjExtraTotComponent } from './components/ddjj-extra-tot/ddjj-extra-tot.component';
import { DdjjContrafacturaTotComponent } from './components/ddjj-contrafactura-tot/ddjj-contrafactura-tot.component';
import { DistHorariaGuardiaComponent } from './components/dist-horaria-guardia/dist-horaria-guardia.component';
import { DistHorariaConsComponent } from './components/dist-horaria-cons/dist-horaria-cons.component';
import { DistHorariaGirasComponent } from './components/dist-horaria-giras/dist-horaria-giras.component';
import { DistHorariaOtrasComponent } from './components/dist-horaria-otras/dist-horaria-otras.component';
import { ProfessionalDhHistComponent } from './components/professional-dh-hist/professional-dh-hist.component';
import { ProfessionalDhJunioComponent } from './components/professional-dh-junio/professional-dh-junio.component';
import { CronogramaFormAgregarComponent } from './components/cronograma-form-agregar/cronograma-form-agregar.component';
import { ProfessionalFormEditComponent } from './components/professional-form-edit/professional-form-edit.component';
import { CronogramaDefMaternoComponent } from './components/cronograma-def-materno/cronograma-def-materno.component';
import { CronogramaDefSroqueComponent } from './components/cronograma-def-sroque/cronograma-def-sroque.component';
import { DdjjCargoyagrupTotalApComponent } from './components/ddjj-cargoyagrup-total-ap/ddjj-cargoyagrup-total-ap.component';
import { DdjjCargoyagrupTotalRecComponent } from './components/ddjj-cargoyagrup-total-rec/ddjj-cargoyagrup-total-rec.component';
import { DdjjExtraTotRecComponent } from './components/ddjj-extra-tot-rec/ddjj-extra-tot-rec.component';
import { DdjjExtraTotApComponent } from './components/ddjj-extra-tot-ap/ddjj-extra-tot-ap.component';
import { DdjjContrafacturaTotApComponent } from './components/ddjj-contrafactura-tot-ap/ddjj-contrafactura-tot-ap.component';
import { DdjjContrafacturaTotRecComponent } from './components/ddjj-contrafactura-tot-rec/ddjj-contrafactura-tot-rec.component';
import { ProfessionalFormDeletComponent } from './components/professional-form-delet/professional-form-delet.component';
import { ProfessionalPlantillaDhComponent } from './components/professional-plantilla-dh/professional-plantilla-dh.component';
import { ProfessionalDhJunioAsisComponent } from './components/professional-dh-junio-asis/professional-dh-junio-asis.component';
import { DisponibilidadRamal2Component } from './components/disponibilidad-ramal2/disponibilidad-ramal2.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { PaisComponent } from './components/configuracion/territorio/pais/pais.component';
import { ProvinciaComponent } from './components/configuracion/territorio/provincia/provincia.component';
import { PaisEditComponent } from './components/configuracion/territorio/pais-edit/pais-edit.component';
import { PaisDetailComponent } from './components/configuracion/territorio/pais-detail/pais-detail.component';
import { PaisNewComponent } from './components/configuracion/territorio/pais-new/pais-new.component';
import { ProvinciaDetailComponent } from './components/configuracion/territorio/provincia-detail/provincia-detail.component';
import { ProvinciaNewComponent } from './components/configuracion/territorio/provincia-new/provincia-new.component';
import { ProvinciaEditComponent } from './components/configuracion/territorio/provincia-edit/provincia-edit.component';
import { DepartamentoComponent } from './components/configuracion/territorio/departamento/departamento.component';
import { DepartamentoNewComponent } from './components/configuracion/territorio/departamento-new/departamento-new.component';
import { DepartamentoEditComponent } from './components/configuracion/territorio/departamento-edit/departamento-edit.component';
import { DepartamentoDetailComponent } from './components/configuracion/territorio/departamento-detail/departamento-detail.component';
import { LocalidadComponent } from './components/configuracion/territorio/localidad/localidad.component';
import { LocalidadNewComponent } from './components/configuracion/territorio/localidad-new/localidad-new.component';
import { LocalidadEditComponent } from './components/configuracion/territorio/localidad-edit/localidad-edit.component';
import { LocalidadDetailComponent } from './components/configuracion/territorio/localidad-detail/localidad-detail.component';
import { PruebaTerritorioComponent } from './components/configuracion/territorio/prueba-territorio/prueba-territorio.component';
import { MinisterioComponent } from './components/configuracion/establecimiento/ministerio/ministerio.component';
import { MinisterioNewComponent } from './components/configuracion/establecimiento/ministerio-new/ministerio-new.component';
import { MinisterioDetailComponent } from './components/configuracion/establecimiento/ministerio-detail/ministerio-detail.component';
import { MinisterioEditComponent } from './components/configuracion/establecimiento/ministerio-edit/ministerio-edit.component';
import { HospitalComponent } from './components/configuracion/establecimiento/hospital/hospital.component';
import { HospitalDetailComponent } from './components/configuracion/establecimiento/hospital-detail/hospital-detail.component';
import { HospitalEditComponent } from './components/configuracion/establecimiento/hospital-edit/hospital-edit.component';
import { HospitalNewComponent } from './components/configuracion/establecimiento/hospital-new/hospital-new.component';
import { CapsComponent } from './components/configuracion/establecimiento/caps/caps.component';
import { RegionComponent } from './components/configuracion/establecimiento/region/region.component';
import { RegionNewComponent } from './components/configuracion/establecimiento/region-new/region-new.component';
import { RegionDetailComponent } from './components/configuracion/establecimiento/region-detail/region-detail.component';
import { RegionEditComponent } from './components/configuracion/establecimiento/region-edit/region-edit.component';
import { CapsNewComponent } from './components/configuracion/establecimiento/caps-new/caps-new.component';
import { CapsEditComponent } from './components/configuracion/establecimiento/caps-edit/caps-edit.component';
import { CapsDetailComponent } from './components/configuracion/establecimiento/caps-detail/caps-detail.component';
import { FeriadoComponent } from './components/configuracion/calendario/feriado/feriado.component';
import { FeriadoNewComponent } from './components/configuracion/calendario/feriado-new/feriado-new.component';
import { FeriadoDetailComponent } from './components/configuracion/calendario/feriado-detail/feriado-detail.component';
import { FeriadoEditComponent } from './components/configuracion/calendario/feriado-edit/feriado-edit.component';
import { NotificacionComponent } from './components/notificacion/notificacion.component';
import { NotificacionEditComponent } from './components/notificacion/notificacion-edit/notificacion-edit.component';
import { ProfesionComponent } from './components/configuracion/profesionales/profesion/profesion.component';
import { ProfesionDetailComponent } from './components/configuracion/profesionales/profesion-detail/profesion-detail.component';
import { ProfesionEditComponent } from './components/configuracion/profesionales/profesion-edit/profesion-edit.component';
import { EspecialidadComponent } from './components/configuracion/profesionales/especialidad/especialidad.component';
import { EspecialidadEditComponent } from './components/configuracion/profesionales/especialidad-edit/especialidad-edit.component';
import { EspecialidadDetailComponent } from './components/configuracion/profesionales/especialidad-detail/especialidad-detail.component';
import { PruebaFormComponent } from './components/configuracion/territorio/prueba-form/prueba-form.component';
import { PruebaDetailComponent } from './components/configuracion/territorio/prueba-detail/prueba-detail.component';


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
    ProfessionalDhJunioAsisComponent,
    DisponibilidadRamal2Component,
    ConfiguracionComponent,
    PaisComponent,
    ProvinciaComponent,
    PaisEditComponent,
    PaisDetailComponent,
    PaisNewComponent,
    ProvinciaDetailComponent,
    ProvinciaNewComponent,
    ProvinciaEditComponent,
    DepartamentoComponent,
    DepartamentoNewComponent,
    DepartamentoEditComponent,
    DepartamentoDetailComponent,
    LocalidadComponent,
    LocalidadNewComponent,
    LocalidadEditComponent,
    LocalidadDetailComponent,
    PruebaTerritorioComponent,
    MinisterioComponent,
    MinisterioNewComponent,
    MinisterioDetailComponent,
    MinisterioEditComponent,
    HospitalComponent,
    HospitalDetailComponent,
    HospitalEditComponent,
    HospitalNewComponent,
    CapsComponent,
    RegionComponent,
    RegionNewComponent,
    RegionDetailComponent,
    RegionEditComponent,
    CapsNewComponent,
    CapsEditComponent,
    CapsDetailComponent,
    FeriadoComponent,
    FeriadoNewComponent,
    FeriadoDetailComponent,
    FeriadoEditComponent,
    NotificacionComponent,
    NotificacionEditComponent,
    ProfesionComponent,
    ProfesionDetailComponent,
    ProfesionEditComponent,
    EspecialidadComponent,
    EspecialidadEditComponent,
    EspecialidadDetailComponent,
    PruebaFormComponent,
    PruebaDetailComponent,
    
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
    MatDividerModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatCardModule,   
    MatRadioModule,
    ToastrModule.forRoot() // ToastrModule added
    
  ],
  providers: [
    ProfessionalDataServiceService,
    {provide: LOCALE_ID,useValue:'es'}
  ],
  
  bootstrap: [AppComponent],
})
export class AppModule {}
