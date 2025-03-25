import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { NovedadesPersonCreateComponent } from './components/personal/novedades/novedades-person-create/novedades-person-create.component';
import { NovedadesPersonEditComponent } from './components/personal/novedades/novedades-person-edit/novedades-person-edit.component';
import { NovedadesPersonComponent } from './components/personal/novedades/novedades-person/novedades-person.component';
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


import { DdjjCargoyagrupComponent } from './components/guardias/ddjj-cargoyagrup/ddjj-cargoyagrup.component';
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
import { RegistroActividadesEgresoComponent } from './components/actividades/registro-actividades-egreso/registro-actividades-egreso.component';
import { RegistroActividadesIngresoComponent } from './components/actividades/registro-actividades-ingreso/registro-actividades-ingreso.component';
import { RegistroDiarioProfesionalComponent } from './components/actividades/registro-diario-profesional/registro-diario-profesional.component';
import { EfectorDetailComponent } from './components/configuracion/establecimiento/efector-detail/efector-detail.component';
import { EfectorEditComponent } from './components/configuracion/establecimiento/efector-edit/efector-edit.component';
import { EfectorComponent } from './components/configuracion/establecimiento/efector/efector.component';
import { PermisosEfectoresComponent } from './components/configuracion/establecimiento/permisos-efectores/permisos-efectores.component';
import { UdoDetailComponent } from './components/configuracion/establecimiento/udo-detail/udo-detail.component';
import { UdoEditComponent } from './components/configuracion/establecimiento/udo-edit/udo-edit.component';
import { UdoComponent } from './components/configuracion/establecimiento/udo/udo.component';
import { ValoresBonoUtiCreateComponent } from './components/configuracion/info/valores-bono-uti-create/valores-bono-uti-create.component';
import { ValoresGuardiasCreateComponent } from './components/configuracion/info/valores-guardias-create/valores-guardias-create.component';
import { ValoresGuardiasComponent } from './components/configuracion/info/valores-guardias/valores-guardias.component';
import { ArticuloDetailComponent } from './components/configuracion/leyes/articulo-detail/articulo-detail.component';
import { ArticuloEditComponent } from './components/configuracion/leyes/articulo-edit/articulo-edit.component';
import { ArticuloComponent } from './components/configuracion/leyes/articulo/articulo.component';
import { IncisoDetailComponent } from './components/configuracion/leyes/inciso-detail/inciso-detail.component';
import { IncisoEditComponent } from './components/configuracion/leyes/inciso-edit/inciso-edit.component';
import { IncisoComponent } from './components/configuracion/leyes/inciso/inciso.component';
import { TipoLeyEditComponent } from './components/configuracion/leyes/tipo-ley-edit/tipo-ley-edit.component';
import { TipoLeyComponent } from './components/configuracion/leyes/tipo-ley/tipo-ley.component';
import { TipoLicenciaDetailComponent } from './components/configuracion/leyes/tipo-licencia-detail/tipo-licencia-detail.component';
import { TipoLicenciaEditComponent } from './components/configuracion/leyes/tipo-licencia-edit/tipo-licencia-edit.component';
import { TipoLicenciaComponent } from './components/configuracion/leyes/tipo-licencia/tipo-licencia.component';
import { SoporteFormComponent } from './components/configuracion/soporte-form/soporte-form.component';
import { PersonDetailComponent } from './components/configuracion/usuarios/person-detail/person-detail.component';
import { PersonEditComponent } from './components/configuracion/usuarios/person-edit/person-edit.component';
import { PersonComponent } from './components/configuracion/usuarios/person/person.component';
import { RevistaDetailComponent } from './components/configuracion/usuarios/revista-detail/revista-detail.component';
import { RevistaEditComponent } from './components/configuracion/usuarios/revista-edit/revista-edit.component';
import { RevistaComponent } from './components/configuracion/usuarios/revista/revista.component';
import { TipoRevistaEditComponent } from './components/configuracion/usuarios/tipo-revista-edit/tipo-revista-edit.component';
import { UsuarioDetailComponent } from './components/configuracion/usuarios/usuario-detail/usuario-detail.component';
import { UsuarioEditComponent } from './components/configuracion/usuarios/usuario-edit/usuario-edit.component';
import { UsuarioComponent } from './components/configuracion/usuarios/usuario/usuario.component';
import { CronogramaDetailComponent } from './components/cronogramas/cronograma-detail/cronograma-detail.component';
import { DdjjCargoyagrupDetailComponent } from './components/guardias/ddjj-cargoyagrup-detail/ddjj-cargoyagrup-detail.component';
import { DdjjExtraDetailComponent } from './components/guardias/ddjj-extra-detail/ddjj-extra-detail.component';
import { DialogConfirmDdjjComponent } from './components/guardias/dialog-confirm-ddjj/dialog-confirm-ddjj.component';
import { HomeAutoridadComponent } from './components/home-autoridad/home-autoridad.component';
import { EfectorSelectorComponent } from './components/home-page/efector-selector/efector-selector.component';
import { HomeProfesionalComponent } from './components/home-profesional/home-profesional.component';
import { SelectorRolesComponent } from './components/login/selector-roles/selector-roles.component';
import { AsistProfesionalComponent } from './components/personal/asist-profesional/asist-profesional.component';
import { LegajoCreateNoasistencialComponent } from './components/personal/legajo/legajo-create-noasistencial/legajo-create-noasistencial.component';
import { LegajoCreateComponent } from './components/personal/legajo/legajo-create/legajo-create.component';
import { LegajoDetailComponent } from './components/personal/legajo/legajo-detail/legajo-detail.component';
import { LegajoEditNoasistencialComponent } from './components/personal/legajo/legajo-edit-noasistencial/legajo-edit-noasistencial.component';
import { LegajoEditComponent } from './components/personal/legajo/legajo-edit/legajo-edit.component';
import { LegajoNoAsistencialComponent } from './components/personal/legajo/legajo-no-asistencial/legajo-no-asistencial.component';
import { LegajoPersonComponent } from './components/personal/legajo/legajo-person/legajo-person.component';
import { MotivoBajaDialogComponent } from './components/personal/legajo/motivo-baja-dialog/motivo-baja-dialog.component';
import { NovedadesPersonDetailComponent } from './components/personal/novedades/novedades-person-detail/novedades-person-detail.component';
import { PersonalAutoridadComponent } from './components/personal/personal-autoridad/personal-autoridad.component';
import { AsistencialCreateComponent } from './components/personal/personal-contenido/asistencial-create/asistencial-create.component';
import { AsistencialDetailComponent } from './components/personal/personal-contenido/asistencial-detail/asistencial-detail.component';
import { AsistencialEditComponent } from './components/personal/personal-contenido/asistencial-edit/asistencial-edit.component';
import { AsistencialSelectorComponent } from './components/personal/personal-contenido/asistencial-selector/asistencial-selector.component';
import { AsistencialComponent } from './components/personal/personal-contenido/asistencial/asistencial.component';
import { AutoridadDetailComponent } from './components/personal/personal-contenido/autoridad-detail/autoridad-detail.component';
import { AutoridadEditComponent } from './components/personal/personal-contenido/autoridad-edit/autoridad-edit.component';
import { AutoridadComponent } from './components/personal/personal-contenido/autoridad/autoridad.component';
import { CargoDetailComponent } from './components/personal/personal-contenido/cargo-detail/cargo-detail.component';
import { CargoEditComponent } from './components/personal/personal-contenido/cargo-edit/cargo-edit.component';
import { CargoComponent } from './components/personal/personal-contenido/cargo/cargo.component';
import { ExternoComponent } from './components/personal/personal-contenido/externo/externo.component';
import { NoAsistencialCreateComponent } from './components/personal/personal-contenido/no-asistencial-create/no-asistencial-create.component';
import { NoAsistencialDetailComponent } from './components/personal/personal-contenido/no-asistencial-detail/no-asistencial-detail.component';
import { NoAsistencialEditComponent } from './components/personal/personal-contenido/no-asistencial-edit/no-asistencial-edit.component';
import { NoAsistencialComponent } from './components/personal/personal-contenido/no-asistencial/no-asistencial.component';
import { SinEfectorComponent } from './components/personal/personal-contenido/sin-efector/sin-efector.component';
import { SinLegajoComponent } from './components/personal/personal-contenido/sin-legajo/sin-legajo.component';
import { PersonalDhHistorialComponent } from './components/personal/personal-dh-historial/personal-dh-historial.component';
import { PersonalDhComponent } from './components/personal/personal-dh/personal-dh.component';
import { PersonalExternoComponent } from './components/personal/personal-externo/personal-externo.component';
import { PersonalLegajoNoAsistencialComponent } from './components/personal/personal-legajo-no-asistencial/personal-legajo-no-asistencial.component';
import { PersonalLegajoSelectComponent } from './components/personal/personal-legajo-select/personal-legajo-select.component';
import { PersonalLegajoComponent } from './components/personal/personal-legajo/personal-legajo.component';
import { PersonalNoAsistencialComponent } from './components/personal/personal-no-asistencial/personal-no-asistencial.component';
import { PersonalSinEfectorComponent } from './components/personal/personal-sin-efector/personal-sin-efector.component';
import { PersonalSinLegajoComponent } from './components/personal/personal-sin-legajo/personal-sin-legajo.component';
import { PersonalComponent } from './components/personal/personal/personal.component';
import { interceptorProvider } from './interceptors/interceptor.service';

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
    NovedadesPersonCreateComponent,
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
    CargoDetailComponent,
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
    RevistaDetailComponent,
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
    ArticuloEditComponent,
    IncisoComponent,
    IncisoDetailComponent,
    IncisoEditComponent,
    PersonalDhHistorialComponent,
    NoAsistencialCreateComponent,
    PersonalNoAsistencialComponent,
    PersonalLegajoSelectComponent,
    TipoLicenciaComponent,
    TipoLicenciaEditComponent,
    TipoLicenciaDetailComponent,
    LegajoNoAsistencialComponent,
    PersonalLegajoNoAsistencialComponent,
    RegistroActividadesEgresoComponent,
    RegistroActividadesIngresoComponent,
    PermisosEfectoresComponent,
    HomeAutoridadComponent,
    LegajoCreateNoasistencialComponent,
    LegajoEditNoasistencialComponent,
    SinLegajoComponent,
    MotivoBajaDialogComponent,
    PersonalSinLegajoComponent,
    ExternoComponent,
    PersonalExternoComponent,
    UsuarioComponent,
    UsuarioDetailComponent,
    UsuarioEditComponent,
    EfectorSelectorComponent,
    SelectorRolesComponent,
    SinEfectorComponent,
    PersonalSinEfectorComponent,
    
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
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatListModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTabsModule,
    MatBottomSheetModule,
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
export class AppModule {
  constructor() {
    registerLocaleData(localeEsAr, 'es-AR');
  }
}
