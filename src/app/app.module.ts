import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { CalendarCommonModule, CalendarModule, CalendarMonthModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { AppRoutingModule } from './app-routing.module';
import { CategoriaCreateComponent } from './components/configuracion/usuarios/categoria-create/categoria-create.component';
import { SharedModule } from './components/shared/shared.module';

//Angular nativo

//Componentes sistema

//Librerias
//Librerias--calendario
//Libreria--fechas
//Libreria--hora
//


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
import { RegDiarioComponent } from './components/actividades/reg-diario/reg-diario.component';
import { RegistroActividadesComponent } from './components/actividades/registro-actividades/registro-actividades.component';
import { RegistroDiarioComponent } from './components/actividades/registro-diario/registro-diario.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DailyScheduleComponent } from './components/daily-schedule/daily-schedule.component';
import { FooterComponent } from './components/footer/footer.component';
import { DdjjExtraComponent } from './components/guardias/ddjj-extra/ddjj-extra.component';
import { GuardiaActivaComponent } from './components/guardias/guardia-activa/guardia-activa.component';
import { GuardiaPasivaComponent } from './components/guardias/guardia-pasiva/guardia-pasiva.component';
import { GuardiasViewComponent } from './components/guardias/guardias-view/guardias-view.component';
import { HeaderComponent } from './components/header/header.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { DistHorariaComponent } from './components/personal/dist-horaria/dist-horaria.component';
import { NovedadesPersonEditComponent } from './components/personal/novedades-person-edit/novedades-person-edit.component';
import { NovedadesPersonComponent } from './components/personal/novedades-person/novedades-person.component';
import { PopupComponent } from './components/popup/popup.component';
import { ProfessionalAbmComponent } from './components/professional-abm/professional-abm.component';
import { ProfessionalFormComponent } from './components/professional-form/professional-form.component';
import { ProfessionalListComponent } from './components/professional-list/professional-list.component';
import { ProfessionalNewsComponent } from './components/professional-news/professional-news.component';
import { ProfessionalTableComponent } from './components/professional-table/professional-table.component';
import { ScheduleCardComponent } from './components/schedule-card/schedule-card.component';
import { ScheduleDistributionComponent } from './components/schedule-distribution/schedule-distribution.component';
import { SearchProfessionalComponent } from './components/search-professional/search-professional.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { ProfessionalDataServiceService } from './services/ProfessionalDataService/professional-data-service.service';


import { DdjjContrafacturaComponent } from './components/guardias/ddjj-contrafactura/ddjj-contrafactura.component';
import { ProfessionalDetailComponent } from './components/professional-detail/professional-detail.component';

//Toastr
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


//Date Import
import { DistHorariaConsComponent } from './components/actividades/dist-horaria-cons/dist-horaria-cons.component';
import { DistHorariaGirasComponent } from './components/actividades/dist-horaria-giras/dist-horaria-giras.component';
import { DistHorariaGuardiaComponent } from './components/actividades/dist-horaria-guardia/dist-horaria-guardia.component';
import { DistHorariaOtrasComponent } from './components/actividades/dist-horaria-otras/dist-horaria-otras.component';
import { ArrayFecComponent } from './components/array-fec/array-fec.component';
import { FeriadoDetailComponent } from './components/configuracion/calendario/feriado-detail/feriado-detail.component';
import { FeriadoEditComponent } from './components/configuracion/calendario/feriado-edit/feriado-edit.component';
import { FeriadoComponent } from './components/configuracion/calendario/feriado/feriado.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { CapsDetailComponent } from './components/configuracion/establecimiento/caps-detail/caps-detail.component';
import { CapsEditComponent } from './components/configuracion/establecimiento/caps-edit/caps-edit.component';
import { CapsComponent } from './components/configuracion/establecimiento/caps/caps.component';
import { HospitalDetailComponent } from './components/configuracion/establecimiento/hospital-detail/hospital-detail.component';
import { HospitalEditComponent } from './components/configuracion/establecimiento/hospital-edit/hospital-edit.component';
import { HospitalComponent } from './components/configuracion/establecimiento/hospital/hospital.component';
import { MinisterioDetailComponent } from './components/configuracion/establecimiento/ministerio-detail/ministerio-detail.component';
import { MinisterioEditComponent } from './components/configuracion/establecimiento/ministerio-edit/ministerio-edit.component';
import { MinisterioComponent } from './components/configuracion/establecimiento/ministerio/ministerio.component';
import { RegionDetailComponent } from './components/configuracion/establecimiento/region-detail/region-detail.component';
import { RegionEditComponent } from './components/configuracion/establecimiento/region-edit/region-edit.component';
import { RegionComponent } from './components/configuracion/establecimiento/region/region.component';
import { EspecialidadDetailComponent } from './components/configuracion/profesionales/especialidad-detail/especialidad-detail.component';
import { EspecialidadEditComponent } from './components/configuracion/profesionales/especialidad-edit/especialidad-edit.component';
import { EspecialidadComponent } from './components/configuracion/profesionales/especialidad/especialidad.component';
import { ProfesionDetailComponent } from './components/configuracion/profesionales/profesion-detail/profesion-detail.component';
import { ProfesionEditComponent } from './components/configuracion/profesionales/profesion-edit/profesion-edit.component';
import { ProfesionComponent } from './components/configuracion/profesionales/profesion/profesion.component';
import { DepartamentoDetailComponent } from './components/configuracion/territorio/departamento-detail/departamento-detail.component';
import { DepartamentoEditComponent } from './components/configuracion/territorio/departamento-edit/departamento-edit.component';
import { DepartamentoComponent } from './components/configuracion/territorio/departamento/departamento.component';
import { LocalidadDetailComponent } from './components/configuracion/territorio/localidad-detail/localidad-detail.component';
import { LocalidadEditComponent } from './components/configuracion/territorio/localidad-edit/localidad-edit.component';
import { LocalidadComponent } from './components/configuracion/territorio/localidad/localidad.component';
import { PaisDetailComponent } from './components/configuracion/territorio/pais-detail/pais-detail.component';
import { PaisEditComponent } from './components/configuracion/territorio/pais-edit/pais-edit.component';
import { PaisComponent } from './components/configuracion/territorio/pais/pais.component';
import { ProvinciaDetailComponent } from './components/configuracion/territorio/provincia-detail/provincia-detail.component';
import { ProvinciaEditComponent } from './components/configuracion/territorio/provincia-edit/provincia-edit.component';
import { ProvinciaComponent } from './components/configuracion/territorio/provincia/provincia.component';
import { PruebaDetailComponent } from './components/configuracion/territorio/prueba-detail/prueba-detail.component';
import { PruebaFormComponent } from './components/configuracion/territorio/prueba-form/prueba-form.component';
import { PruebaForm2Component } from './components/configuracion/territorio/prueba-form2/prueba-form2.component';
import { PruebaTerritorioComponent } from './components/configuracion/territorio/prueba-territorio/prueba-territorio.component';
import { CronogramaDefMaternoComponent } from './components/cronogramas/cronograma-def-materno/cronograma-def-materno.component';
import { CronogramaDefSroqueComponent } from './components/cronogramas/cronograma-def-sroque/cronograma-def-sroque.component';
import { CronogramaDefComponent } from './components/cronogramas/cronograma-def/cronograma-def.component';
import { CronogramaFormAgregarComponent } from './components/cronogramas/cronograma-form-agregar/cronograma-form-agregar.component';
import { CronogramaPDefTotComponent } from './components/cronogramas/cronograma-p-def-tot/cronograma-p-def-tot.component';
import { CronogramaPDefComponent } from './components/cronogramas/cronograma-p-def/cronograma-p-def.component';
import { CronogramaPHosComponent } from './components/cronogramas/cronograma-p-hos/cronograma-p-hos.component';
import { CronogramaPComponent } from './components/cronogramas/cronograma-p/cronograma-p.component';
import { CronogramaRegComponent } from './components/cronogramas/cronograma-reg/cronograma-reg.component';
import { CronogramaComponent } from './components/cronogramas/cronograma/cronograma.component';
import { DigestoComponent } from './components/digesto/digesto.component';
import { DisponibilidadRamal2Component } from './components/disponibilidad-ramal2/disponibilidad-ramal2.component';
import { DisponibilidadComponent } from './components/disponibilidad/disponibilidad.component';
import { DdjjCargoyagrupTotComponent } from './components/guardias/ddjj-cargoyagrup-tot/ddjj-cargoyagrup-tot.component';
import { DdjjCargoyagrupTotalApComponent } from './components/guardias/ddjj-cargoyagrup-total-ap/ddjj-cargoyagrup-total-ap.component';
import { DdjjCargoyagrupTotalRecComponent } from './components/guardias/ddjj-cargoyagrup-total-rec/ddjj-cargoyagrup-total-rec.component';
import { DdjjContrafacturaTotApComponent } from './components/guardias/ddjj-contrafactura-tot-ap/ddjj-contrafactura-tot-ap.component';
import { DdjjContrafacturaTotRecComponent } from './components/guardias/ddjj-contrafactura-tot-rec/ddjj-contrafactura-tot-rec.component';
import { DdjjContrafacturaTotComponent } from './components/guardias/ddjj-contrafactura-tot/ddjj-contrafactura-tot.component';
import { DdjjExtraTotApComponent } from './components/guardias/ddjj-extra-tot-ap/ddjj-extra-tot-ap.component';
import { DdjjExtraTotRecComponent } from './components/guardias/ddjj-extra-tot-rec/ddjj-extra-tot-rec.component';
import { DdjjExtraTotComponent } from './components/guardias/ddjj-extra-tot/ddjj-extra-tot.component';
import { DdjjTentativoComponent } from './components/guardias/ddjj-tentativo/ddjj-tentativo.component';
import { GuardiasViewPComponent } from './components/guardias/guardias-view-p/guardias-view-p.component';
import { HistorialComponent } from './components/historial/historial.component';
import { MonthTableComponent } from './components/month-table/month-table.component';
import { NotificacionDetailComponent } from './components/notificacion/notificacion-detail/notificacion-detail.component';
import { NotificacionEditComponent } from './components/notificacion/notificacion-edit/notificacion-edit.component';
import { NotificacionComponent } from './components/notificacion/notificacion.component';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { PopupCalendarioDispComponent } from './components/popup-calendario-disp/popup-calendario-disp.component';
import { PopupCalendarioDisp2Component } from './components/popup-calendario-disp2/popup-calendario-disp2.component';
import { PopupCalendarioVacioComponent } from './components/popup-calendario-vacio/popup-calendario-vacio.component';
import { PopupCalendarioComponent } from './components/popup-calendario/popup-calendario.component';
import { PopupDdjjCfEditComponent } from './components/popup-ddjj-cf-edit/popup-ddjj-cf-edit.component';
import { PopupDdjjCfComponent } from './components/popup-ddjj-cf/popup-ddjj-cf.component';
import { PopupNovedadAgregarComponent } from './components/popup-novedad-agregar/popup-novedad-agregar.component';
import { ProfessionalDhHistComponent } from './components/professional-dh-hist/professional-dh-hist.component';
import { ProfessionalDhJunioAsisComponent } from './components/professional-dh-junio-asis/professional-dh-junio-asis.component';
import { ProfessionalDhJunioComponent } from './components/professional-dh-junio/professional-dh-junio.component';
import { ProfessionalDhComponent } from './components/professional-dh/professional-dh.component';
import { ProfessionalFormDeletComponent } from './components/professional-form-delet/professional-form-delet.component';
import { ProfessionalFormEditComponent } from './components/professional-form-edit/professional-form-edit.component';
import { ProfessionalPlantillaDhComponent } from './components/professional-plantilla-dh/professional-plantilla-dh.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TablaComponent } from './components/tabla/tabla.component';
import { SpinnerInterceptor } from './services/spinner-interceptor.service';

import localeEsAr from '@angular/common/locales/es-AR';
import { RegistroDiarioProfesionalComponent } from './components/actividades/registro-diario-profesional/registro-diario-profesional.component';
import { EfectorDetailComponent } from './components/configuracion/establecimiento/efector-detail/efector-detail.component';
import { EfectorEditComponent } from './components/configuracion/establecimiento/efector-edit/efector-edit.component';
import { EfectorComponent } from './components/configuracion/establecimiento/efector/efector.component';
import { UdoDetailComponent } from './components/configuracion/establecimiento/udo-detail/udo-detail.component';
import { UdoEditComponent } from './components/configuracion/establecimiento/udo-edit/udo-edit.component';
import { UdoComponent } from './components/configuracion/establecimiento/udo/udo.component';
import { ValoresBonoUtiCreateComponent } from './components/configuracion/info/valores-bono-uti-create/valores-bono-uti-create.component';
import { ValoresGuardiasCreateComponent } from './components/configuracion/info/valores-guardias-create/valores-guardias-create.component';
import { ValoresGuardiasComponent } from './components/configuracion/info/valores-guardias/valores-guardias.component';
import { ArticuloDetailComponent } from './components/configuracion/leyes/articulo-detail/articulo-detail.component';

import { ArticuloComponent } from './components/configuracion/leyes/articulo/articulo.component';
import { IncisoDetailComponent } from './components/configuracion/leyes/inciso-detail/inciso-detail.component';
import { IncisoEditComponent } from './components/configuracion/leyes/inciso-edit/inciso-edit.component';
import { IncisoComponent } from './components/configuracion/leyes/inciso/inciso.component';
import { TipoLeyEditComponent } from './components/configuracion/leyes/tipo-ley-edit/tipo-ley-edit.component';
import { TipoLeyComponent } from './components/configuracion/leyes/tipo-ley/tipo-ley.component';
import { SoporteFormComponent } from './components/configuracion/soporte-form/soporte-form.component';
import { AdicionalCreateComponent } from './components/configuracion/usuarios/adicional-create/adicional-create.component';
import { AdicionalEditComponent } from './components/configuracion/usuarios/adicional-edit/adicional-edit.component';
import { AsistencialCreateComponent } from './components/configuracion/usuarios/asistencial-create/asistencial-create.component';
import { AsistencialDetailComponent } from './components/configuracion/usuarios/asistencial-detail/asistencial-detail.component';
import { AsistencialEditComponent } from './components/configuracion/usuarios/asistencial-edit/asistencial-edit.component';
import { AsistencialSelectorComponent } from './components/configuracion/usuarios/asistencial-selector/asistencial-selector.component';
import { AsistencialComponent } from './components/configuracion/usuarios/asistencial/asistencial.component';
import { AutoridadDetailComponent } from './components/configuracion/usuarios/autoridad-detail/autoridad-detail.component';
import { AutoridadEditComponent } from './components/configuracion/usuarios/autoridad-edit/autoridad-edit.component';
import { AutoridadComponent } from './components/configuracion/usuarios/autoridad/autoridad.component';
import { CargaHorariaCreateComponent } from './components/configuracion/usuarios/carga-horaria-create/carga-horaria-create.component';
import { CargaHorariaEditComponent } from './components/configuracion/usuarios/carga-horaria-edit/carga-horaria-edit.component';
import { CargoDetailComponent } from './components/configuracion/usuarios/cargo-detail/cargo-detail.component';
import { CargoEditComponent } from './components/configuracion/usuarios/cargo-edit/cargo-edit.component';
import { CargoComponent } from './components/configuracion/usuarios/cargo/cargo.component';
import { CategoriaEditComponent } from './components/configuracion/usuarios/categoria-edit/categoria-edit.component';
import { LegajoCreateComponent } from './components/configuracion/usuarios/legajo-create/legajo-create.component';
import { LegajoDetailComponent } from './components/configuracion/usuarios/legajo-detail/legajo-detail.component';
import { LegajoEditComponent } from './components/configuracion/usuarios/legajo-edit/legajo-edit.component';
import { LegajoPersonEditComponent } from './components/configuracion/usuarios/legajo-person-edit/legajo-person-edit.component';
import { LegajoPersonComponent } from './components/configuracion/usuarios/legajo-person/legajo-person.component';
import { LegajoComponent } from './components/configuracion/usuarios/legajo/legajo.component';
import { NoAsistencialDetailComponent } from './components/configuracion/usuarios/no-asistencial-detail/no-asistencial-detail.component';
import { NoAsistencialEditComponent } from './components/configuracion/usuarios/no-asistencial-edit/no-asistencial-edit.component';
import { NoAsistencialComponent } from './components/configuracion/usuarios/no-asistencial/no-asistencial.component';
import { PersonDetailComponent } from './components/configuracion/usuarios/person-detail/person-detail.component';
import { PersonEditComponent } from './components/configuracion/usuarios/person-edit/person-edit.component';
import { PersonComponent } from './components/configuracion/usuarios/person/person.component';
import { RevistaDetailComponent } from './components/configuracion/usuarios/revista-detail/revista-detail.component';
import { RevistaEditComponent } from './components/configuracion/usuarios/revista-edit/revista-edit.component';
import { RevistaComponent } from './components/configuracion/usuarios/revista/revista.component';
import { TipoRevistaCreateComponent } from './components/configuracion/usuarios/tipo-revista-create/tipo-revista-create.component';
import { TipoRevistaEditComponent } from './components/configuracion/usuarios/tipo-revista-edit/tipo-revista-edit.component';
import { CronogramaDetailComponent } from './components/cronogramas/cronograma-detail/cronograma-detail.component';
import { DdjjCargoyagrupDetailComponent } from './components/guardias/ddjj-cargoyagrup-detail/ddjj-cargoyagrup-detail.component';
import { DdjjCargoyagrupComponent } from './components/guardias/ddjj-cargoyagrup/ddjj-cargoyagrup.component';
import { DdjjExtraDetailComponent } from './components/guardias/ddjj-extra-detail/ddjj-extra-detail.component';
import { DialogConfirmDdjjComponent } from './components/guardias/dialog-confirm-ddjj/dialog-confirm-ddjj.component';
import { HomeProfesionalComponent } from './components/home-profesional/home-profesional.component';
import { AsistProfesionalComponent } from './components/personal/asist-profesional/asist-profesional.component';
import { NovedadesPersonDetailComponent } from './components/personal/novedades-person-detail/novedades-person-detail.component';
import { PersonalAutoridadComponent } from './components/personal/personal-autoridad/personal-autoridad.component';
import { PersonalDhComponent } from './components/personal/personal-dh/personal-dh.component';
import { PersonalLegajoComponent } from './components/personal/personal-legajo/personal-legajo.component';
import { PersonalComponent } from './components/personal/personal/personal.component';
import { interceptorProvider } from './interceptors/interceptor.service';
registerLocaleData(localeEsAr, 'es-AR');


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
    NovedadesPersonEditComponent,
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
    ProvinciaDetailComponent,
    ProvinciaEditComponent,
    DepartamentoComponent,
    DepartamentoEditComponent,
    DepartamentoDetailComponent,
    LocalidadComponent,
    LocalidadEditComponent,
    LocalidadDetailComponent,
    PruebaTerritorioComponent,
    MinisterioComponent,
    MinisterioDetailComponent,
    MinisterioEditComponent,
    HospitalComponent,
    HospitalDetailComponent,
    HospitalEditComponent,
    CapsComponent,
    RegionComponent,
    RegionDetailComponent,
    RegionEditComponent,
    CapsEditComponent,
    CapsDetailComponent,
    FeriadoComponent,
    FeriadoDetailComponent,
    FeriadoEditComponent,
    NotificacionComponent,
    NotificacionEditComponent,
    NotificacionDetailComponent,
    ProfesionComponent,
    ProfesionDetailComponent,
    ProfesionEditComponent,
    EspecialidadComponent,
    EspecialidadEditComponent,
    EspecialidadDetailComponent,
    PruebaFormComponent,
    PruebaDetailComponent,
    SpinnerComponent,
    PruebaForm2Component,
    PersonComponent,
    PersonDetailComponent,
    PersonEditComponent,
    AsistencialComponent,
    AsistencialDetailComponent,
    AsistencialEditComponent,
    NoAsistencialComponent,
    NoAsistencialEditComponent,
    NoAsistencialDetailComponent,
    LegajoComponent,
    LegajoEditComponent,
    LegajoDetailComponent,
    RevistaComponent,
    RevistaEditComponent,
    UdoComponent,
    UdoEditComponent,
    UdoDetailComponent,
    EfectorComponent,
    EfectorEditComponent,
    EfectorDetailComponent,
    LegajoPersonComponent,
    CargoComponent,
    CargoEditComponent,
    CategoriaCreateComponent,
    CategoriaEditComponent,
    CargoDetailComponent,
    LegajoPersonEditComponent,
    CronogramaDetailComponent,
    PersonalComponent,
    PersonalLegajoComponent,
    DdjjCargoyagrupDetailComponent,
    DdjjExtraDetailComponent,
    DialogConfirmDdjjComponent,
    AutoridadComponent,
    AutoridadEditComponent,
    AutoridadDetailComponent,
    HomeProfesionalComponent,
    RegistroDiarioProfesionalComponent,
    ValoresGuardiasComponent,
    PersonalDhComponent,
    AsistProfesionalComponent,
    SoporteFormComponent,
    PersonalAutoridadComponent,
    TipoRevistaEditComponent,
    TipoRevistaCreateComponent,
    RevistaDetailComponent,
    AdicionalCreateComponent,
    AdicionalEditComponent,
    CargaHorariaCreateComponent,
    CargaHorariaEditComponent,
    ValoresGuardiasCreateComponent,
    ValoresBonoUtiCreateComponent,
    AsistencialSelectorComponent,
    LegajoCreateComponent,
    AsistencialCreateComponent,
    NovedadesPersonDetailComponent,
    NovedadesPersonComponent,
    TipoLeyComponent,
    TipoLeyEditComponent,
    ArticuloComponent,
    ArticuloDetailComponent,
 
    IncisoComponent,
    IncisoDetailComponent,
    IncisoEditComponent,
    
  ],

  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ProfessionalTableComponent,
    NgxMatTimepickerModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    SharedModule,
    MatFormFieldModule,
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
    MatInputModule,
    MatDatepickerModule,
    MatCardModule,   
    MatRadioModule,
    MatProgressSpinnerModule,
    MatListModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTabsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    CalendarCommonModule,
    CalendarMonthModule,
    ToastrModule.forRoot(),
    
  ],
  

  providers: [
    ProfessionalDataServiceService,
    { provide: LOCALE_ID, useValue: 'es-AR' },
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true
    },
    interceptorProvider
  ],
  
  bootstrap: [AppComponent],
})
export class AppModule {}
