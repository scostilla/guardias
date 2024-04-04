//COMPONENTES SISTEMA GUARDIAS

//Principales
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';


//Configuraciones: Territorio
import { PaisComponent } from './components/configuracion/territorio/pais/pais.component';
import { PaisDetailComponent } from './components/configuracion/territorio/pais-detail/pais-detail.component';
import { PaisEditComponent } from './components/configuracion/territorio/pais-edit/pais-edit.component';
import { ProvinciaComponent } from './components/configuracion/territorio/provincia/provincia.component';
import { ProvinciaDetailComponent } from './components/configuracion/territorio/provincia-detail/provincia-detail.component';
import { ProvinciaEditComponent } from './components/configuracion/territorio/provincia-edit/provincia-edit.component';
import { DepartamentoComponent } from './components/configuracion/territorio/departamento/departamento.component';
import { DepartamentoDetailComponent } from './components/configuracion/territorio/departamento-detail/departamento-detail.component';
import { DepartamentoEditComponent } from './components/configuracion/territorio/departamento-edit/departamento-edit.component';
import { LocalidadComponent } from './components/configuracion/territorio/localidad/localidad.component';
import { LocalidadDetailComponent } from './components/configuracion/territorio/localidad-detail/localidad-detail.component';
import { LocalidadEditComponent } from './components/configuracion/territorio/localidad-edit/localidad-edit.component';

//Configuraciones: Establecimientos
import { MinisterioComponent } from './components/configuracion/establecimiento/ministerio/ministerio.component';
import { MinisterioDetailComponent } from './components/configuracion/establecimiento/ministerio-detail/ministerio-detail.component';
import { MinisterioEditComponent } from './components/configuracion/establecimiento/ministerio-edit/ministerio-edit.component';
import { HospitalComponent } from './components/configuracion/establecimiento/hospital/hospital.component';
import { HospitalDetailComponent } from './components/configuracion/establecimiento/hospital-detail/hospital-detail.component';
import { HospitalEditComponent } from './components/configuracion/establecimiento/hospital-edit/hospital-edit.component';
import { CapsComponent } from './components/configuracion/establecimiento/caps/caps.component';
import { CapsDetailComponent } from './components/configuracion/establecimiento/caps-detail/caps-detail.component';
import { CapsEditComponent } from './components/configuracion/establecimiento/caps-edit/caps-edit.component';
import { RegionComponent } from './components/configuracion/establecimiento/region/region.component';
import { RegionDetailComponent } from './components/configuracion/establecimiento/region-detail//region-detail.component';
import { RegionEditComponent } from './components/configuracion/establecimiento/region-edit/region-edit.component';

//Configuraciones: Profesionales
import { ProfesionComponent } from './components/configuracion/profesionales/profesion/profesion.component';
import { ProfesionDetailComponent } from './components/configuracion/profesionales/profesion-detail/profesion-detail.component';
import { ProfesionEditComponent } from './components/configuracion/profesionales/profesion-edit/profesion-edit.component';
import { EspecialidadComponent } from './components/configuracion/profesionales/especialidad/especialidad.component';
import { EspecialidadDetailComponent } from './components/configuracion/profesionales/especialidad-detail/especialidad-detail.component';
import { EspecialidadEditComponent } from './components/configuracion/profesionales/especialidad-edit/especialidad-edit.component';

//Configuraciones: Personas
import { PersonComponent } from './components/configuracion/usuarios/person/person.component';
import { PersonDetailComponent } from './components/configuracion/usuarios/person-detail/person-detail.component';
import { PersonEditComponent } from './components/configuracion/usuarios/person-edit/person-edit.component';
import { AsistencialComponent } from './components/configuracion/usuarios/asistencial/asistencial.component';
import { AsistencialDetailComponent } from './components/configuracion/usuarios/asistencial-detail/asistencial-detail.component';
import { AsistencialEditComponent } from './components/configuracion/usuarios/asistencial-edit/asistencial-edit.component';
import { NoAsistencialComponent } from './components/configuracion/usuarios/no-asistencial/no-asistencial.component';
import { NoAsistencialDetailComponent } from './components/configuracion/usuarios/no-asistencial-detail/no-asistencial-detail.component';
import { NoAsistencialEditComponent } from './components/configuracion/usuarios/no-asistencial-edit/no-asistencial-edit.component';
import { LegajoComponent } from './components/configuracion/usuarios/legajo/legajo.component';
import { LegajoDetailComponent } from './components/configuracion/usuarios/legajo-detail/legajo-detail.component';
import { LegajoEditComponent } from './components/configuracion/usuarios/legajo-edit/legajo-edit.component';
import { LegajoPersonComponent } from './components/configuracion/usuarios/legajo-person/legajo-person.component';
import { LegajoPersonEditComponent } from './components/configuracion/usuarios/legajo-person-edit/legajo-person-edit.component';
import { CargoComponent } from './components/configuracion/usuarios/cargo/cargo.component';
import { CargoDetailComponent } from './components/configuracion/usuarios/cargo-detail/cargo-detail.component';
import { CargoEditComponent } from './components/configuracion/usuarios/cargo-edit/cargo-edit.component';



//Configuraciones: Calendario
import { FeriadoComponent } from './components/configuracion/calendario/feriado/feriado.component';
import { FeriadoDetailComponent } from './components/configuracion/calendario/feriado-detail/feriado-detail.component';
import { FeriadoEditComponent } from './components/configuracion/calendario/feriado-edit/feriado-edit.component';





import { ProfessionalFormComponent } from './components/professional-form/professional-form.component';
import { ProfessionalFormEditComponent } from './components/professional-form-edit/professional-form-edit.component';
import { ProfessionalFormDeletComponent } from './components/professional-form-delet/professional-form-delet.component';
import { ProfessionalDhComponent } from './components/professional-dh/professional-dh.component';
import { ProfessionalDhHistComponent } from './components/professional-dh-hist/professional-dh-hist.component';
import { ProfessionalDhJunioComponent } from './components/professional-dh-junio/professional-dh-junio.component';
import { ProfessionalDhJunioAsisComponent } from './components/professional-dh-junio-asis/professional-dh-junio-asis.component';
import { ProfessionalPlantillaDhComponent } from './components/professional-plantilla-dh/professional-plantilla-dh.component';
import { DailyScheduleComponent } from './components/daily-schedule/daily-schedule.component';
import { RegistroDiarioComponent } from './components/registro-diario/registro-diario.component';
import { RegistroActividadesComponent } from './components/registro-actividades/registro-actividades.component';
import { ProfessionalListComponent } from './components/professional-list/professional-list.component';
import { ProfessionalNewsComponent } from './components/professional-news/professional-news.component';
import { ScheduleDistributionComponent } from './components/schedule-distribution/schedule-distribution.component';
import { NovedadesFormComponent } from './components/novedades-form/novedades-form.component';
import { DistHorariaComponent } from './components/dist-horaria/dist-horaria.component';
import { DistHorariaGuardiaComponent } from './components/dist-horaria-guardia/dist-horaria-guardia.component';
import { DistHorariaConsComponent } from './components/dist-horaria-cons/dist-horaria-cons.component';
import { DistHorariaGirasComponent } from './components/dist-horaria-giras/dist-horaria-giras.component';
import { DistHorariaOtrasComponent } from './components/dist-horaria-otras/dist-horaria-otras.component';
import { GuardiasViewComponent } from './components/guardias-view/guardias-view.component';
import { GuardiasViewPComponent } from './components/guardias-view-p/guardias-view-p.component';
import { GuardiaActivaComponent } from './components/guardia-activa/guardia-activa.component';
import { GuardiaPasivaComponent } from './components/guardia-pasiva/guardia-pasiva.component';
import { ProfessionalDetailComponent } from './components/professional-detail/professional-detail.component';
import { DdjjExtraComponent } from './components/ddjj-extra/ddjj-extra.component';
import { DdjjContrafacturaComponent } from './components/ddjj-contrafactura/ddjj-contrafactura.component';
import { DdjjCargoyagrupComponent } from './components/ddjj-cargoyagrup/ddjj-cargoyagrup.component';
import { DdjjExtraTotComponent } from './components/ddjj-extra-tot/ddjj-extra-tot.component';
import { DdjjExtraTotRecComponent } from './components/ddjj-extra-tot-rec/ddjj-extra-tot-rec.component';
import { DdjjExtraTotApComponent } from './components/ddjj-extra-tot-ap/ddjj-extra-tot-ap.component';
import { DdjjContrafacturaTotComponent } from './components/ddjj-contrafactura-tot/ddjj-contrafactura-tot.component';
import { DdjjContrafacturaTotApComponent } from './components/ddjj-contrafactura-tot-ap/ddjj-contrafactura-tot-ap.component';
import { DdjjContrafacturaTotRecComponent } from './components/ddjj-contrafactura-tot-rec/ddjj-contrafactura-tot-rec.component';
import { DdjjCargoyagrupTotComponent } from './components/ddjj-cargoyagrup-tot/ddjj-cargoyagrup-tot.component';
import { DdjjCargoyagrupTotalApComponent } from './components/ddjj-cargoyagrup-total-ap/ddjj-cargoyagrup-total-ap.component';
import { DdjjCargoyagrupTotalRecComponent } from './components/ddjj-cargoyagrup-total-rec/ddjj-cargoyagrup-total-rec.component';
import { DdjjTentativoComponent } from './components/ddjj-tentativo/ddjj-tentativo.component';
import { MonthTableComponent } from './components/month-table/month-table.component';
import { CronogramaComponent } from './components/cronograma/cronograma.component';
import { CronogramaDefComponent } from './components/cronograma-def/cronograma-def.component';
import { CronogramaDefMaternoComponent } from './components/cronograma-def-materno/cronograma-def-materno.component';
import { CronogramaDefSroqueComponent } from './components/cronograma-def-sroque/cronograma-def-sroque.component';
import { CronogramaRegComponent } from './components/cronograma-reg/cronograma-reg.component';
import { CronogramaPComponent } from './components/cronograma-p/cronograma-p.component';
import { CronogramaPDefComponent } from './components/cronograma-p-def/cronograma-p-def.component';
import { CronogramaPDefTotComponent } from './components/cronograma-p-def-tot/cronograma-p-def-tot.component';
import { CronogramaFormAgregarComponent } from './components/cronograma-form-agregar/cronograma-form-agregar.component';
import { CronogramaPHosComponent } from './components/cronograma-p-hos/cronograma-p-hos.component';
import { PopupCalendarioComponent } from './components/popup-calendario/popup-calendario.component';
import { DigestoComponent } from './components/digesto/digesto.component';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { NotificacionComponent } from './components/notificacion/notificacion.component';
import { HistorialComponent } from './components/historial/historial.component';
import { DisponibilidadComponent } from './components/disponibilidad/disponibilidad.component';
import { DisponibilidadRamal2Component } from './components/disponibilidad-ramal2/disponibilidad-ramal2.component';
import { PopupCalendarioDispComponent } from './components/popup-calendario-disp/popup-calendario-disp.component';
import { PopupNovedadAgregarComponent } from './components/popup-novedad-agregar/popup-novedad-agregar.component';
import { PopupDdjjCfComponent } from './components/popup-ddjj-cf/popup-ddjj-cf.component';
import { PopupDdjjCfEditComponent } from './components/popup-ddjj-cf-edit/popup-ddjj-cf-edit.component';

import { CronogramaNewComponent } from './components/cronograma-new/cronograma-new.component';






import { PruebaTerritorioComponent } from './components/configuracion/territorio/prueba-territorio/prueba-territorio.component';
import { PruebaFormComponent } from './components/configuracion/territorio/prueba-form/prueba-form.component';
import { PruebaForm2Component } from './components/configuracion/territorio/prueba-form2/prueba-form2.component';
import { PruebaDetailComponent } from './components/configuracion/territorio/prueba-detail/prueba-detail.component';










const routes: Routes = [
  
  //Principales
  { path: '', component: LoginComponent },
  {path:"home-page", component:HomePageComponent},
  {path: 'configuracion', component:ConfiguracionComponent},

  //Configuraciones: Territorio
  {path: 'pais', component:PaisComponent},
  {path: 'pais-detail/:id', component:PaisDetailComponent},
  {path: 'pais-edit/:id', component:PaisEditComponent},
  {path: 'provincia', component:ProvinciaComponent},
  {path: 'provincia-detail/:id', component:ProvinciaDetailComponent},
  {path: 'provincia-edit/:id', component:ProvinciaEditComponent},
  {path: 'departamento', component:DepartamentoComponent},
  {path: 'departamento-detail/:id', component:DepartamentoDetailComponent},
  {path: 'departamento-edit/:id', component:DepartamentoEditComponent},
  {path: 'localidad', component:LocalidadComponent},
  {path: 'localidad-detail/:id', component:LocalidadDetailComponent},
  {path: 'localidad-edit/:id', component:LocalidadEditComponent},
 
  //Configuraciones: Establecimientos
  {path: 'ministerio', component:MinisterioComponent},
  {path: 'ministerio-detail/:id', component:MinisterioDetailComponent},
  {path: 'ministerio-edit/:id', component:MinisterioEditComponent},
  {path: 'hospital', component:HospitalComponent},
  {path: 'hospital-detail/:id', component:HospitalDetailComponent},
  {path: 'hospital-edit/:id', component:HospitalEditComponent},
  {path: 'caps', component:CapsComponent},
  {path: 'caps-detail/:id', component:CapsDetailComponent},
  {path: 'caps-edit/:id', component:CapsEditComponent},
  {path: 'region', component:RegionComponent},
  {path: 'region-detail/:id', component:RegionDetailComponent},
  {path: 'region-edit/:id', component:RegionEditComponent}, 
 
  //Configuraciones: Profesionales
  {path: 'profesion', component:ProfesionComponent},
  {path: 'profesion-detail/:id', component:ProfesionDetailComponent},
  {path: 'profesion-edit/:id', component:ProfesionEditComponent},
  {path: 'especialidad', component:EspecialidadComponent},
  {path: 'especialidad-detail/:id', component:EspecialidadDetailComponent},
  {path: 'especialidad-edit/:id', component:EspecialidadEditComponent},
 
  //Configuraciones: Personas
  {path: 'person', component:PersonComponent},
  {path: 'person-detail/:id', component:PersonDetailComponent},
  {path: 'person-edit/:id', component:PersonEditComponent},
  {path: 'asistencial', component:AsistencialComponent},
  {path: 'asistencial-detail/:id', component:AsistencialDetailComponent},
  {path: 'asistencial-edit/:id', component:AsistencialEditComponent},
  {path: 'no-asistencial', component:NoAsistencialComponent},
  {path: 'no-asistencial-detail/:id', component:NoAsistencialDetailComponent},
  {path: 'no-asistencial-edit/:id', component:NoAsistencialEditComponent},
  {path: 'legajo', component:LegajoComponent},
  {path: 'legajo-detail/:id', component:LegajoDetailComponent},
  {path: 'legajo-edit/:id', component:LegajoEditComponent},
  {path: 'legajo-person/:id', component:LegajoPersonComponent},
  {path: 'legajo-person-edit/:id', component:LegajoPersonEditComponent},
  {path: 'cargo', component:CargoComponent},
  {path: 'cargo-detail/:id', component:CargoDetailComponent},
  {path: 'cargo-edit/:id', component:CargoEditComponent},


  //Configuraciones: Calendario
  {path: 'feriado', component:FeriadoComponent},
  {path: 'feriado-detail/:id', component:FeriadoDetailComponent},
  {path: 'feriado-edit/:id', component:FeriadoEditComponent},


  { path: 'professional-form', component: ProfessionalFormComponent },
  { path: 'professional-form-edit', component: ProfessionalFormEditComponent },
  { path: 'professional-form-delet', component: ProfessionalFormDeletComponent },
  { path: 'daily-schedule', component: DailyScheduleComponent},
  {path:"registro-diario",component: RegistroDiarioComponent},
  {path:"registro-actividades",component: RegistroActividadesComponent},
  { path: 'professional-list', component: ProfessionalListComponent},
  { path: 'professinal-news', component: ProfessionalNewsComponent},
  { path: 'schedule-distribution', component: ScheduleDistributionComponent},
  {path: 'novedades-form', component: NovedadesFormComponent},
  {path:'dist-horaria', component:DistHorariaComponent},
  {path:'dist-horaria-guardias', component:DistHorariaGuardiaComponent},
  {path:'dist-horaria-cons', component:DistHorariaConsComponent},
  {path:'dist-horaria-giras', component:DistHorariaGirasComponent},
  {path:'dist-horaria-otras', component:DistHorariaOtrasComponent},
  {path:'guardias-view', component: GuardiasViewComponent},
  {path:'guardias-view-p', component: GuardiasViewPComponent},
  {path:'guardia-activa',component:GuardiaActivaComponent},
  {path:'guardia-pasiva', component:GuardiaPasivaComponent},
  {path: 'professional-detail/:id', component: ProfessionalDetailComponent },
  {path: 'professional-dh/:id', component: ProfessionalDhComponent },
  {path: 'professional-dh-hist/:id', component: ProfessionalDhHistComponent },
  {path: 'professional-dh-junio/:id', component: ProfessionalDhJunioComponent },
  {path: 'professional-dh-junio-asis/:id', component: ProfessionalDhJunioAsisComponent },
  {path: 'professional-plantilla-dh/:id', component: ProfessionalPlantillaDhComponent },
  {path:'ddjj-extra',component:DdjjExtraComponent},
  {path:'ddjj-contrafactura',component:DdjjContrafacturaComponent},
  {path:'ddjj-cargoyagrup',component:DdjjCargoyagrupComponent},
  {path:'ddjj-extra-tot',component:DdjjExtraTotComponent},
  {path:'ddjj-extra-tot-rec',component:DdjjExtraTotRecComponent},
  {path:'ddjj-extra-tot-ap',component:DdjjExtraTotApComponent},
  {path:'ddjj-contrafactura-tot',component:DdjjContrafacturaTotComponent},
  {path:'ddjj-contrafactura-tot-ap',component:DdjjContrafacturaTotApComponent},
  {path:'ddjj-contrafactura-tot-rec',component:DdjjContrafacturaTotRecComponent},
  {path:'ddjj-cargoyagrup-tot',component:DdjjCargoyagrupTotComponent},
  {path:'ddjj-cargoyagrup-total-ap',component:DdjjCargoyagrupTotalApComponent},
  {path:'ddjj-cargoyagrup-total-rec',component:DdjjCargoyagrupTotalRecComponent},
  {path:'ddjj-tentativo',component:DdjjTentativoComponent},
 /*  {path:'api', component:ApiComponent} */
 {path:'MonthTableComponent',component:MonthTableComponent},
 {path: 'cronograma', component:CronogramaComponent},
 {path: 'cronograma-def', component:CronogramaDefComponent},
 {path: 'cronograma-def-materno', component:CronogramaDefMaternoComponent},
 {path: 'cronograma-def-sroque', component:CronogramaDefSroqueComponent},
 {path: 'cronograma-reg', component:CronogramaRegComponent},
 {path: 'cronograma-p', component:CronogramaPComponent},
 {path: 'cronograma-p-def', component:CronogramaPDefComponent},
 {path: 'cronograma-p-def-tot', component:CronogramaPDefTotComponent},
 {path: 'cronograma-p-hos', component:CronogramaPHosComponent},
 {path: 'cronograma-form-agregar', component:CronogramaFormAgregarComponent},
 {path: 'popup-calendario', component:PopupCalendarioComponent},
 {path: 'digesto', component:DigestoComponent},
 {path: 'novedades', component:NovedadesComponent}, 
 {path: 'notificacion', component:NotificacionComponent}, 
 {path: 'historial', component:HistorialComponent},
 {path: 'disponibilidad', component:DisponibilidadComponent},
 {path: 'disponibilidad-ramal2', component:DisponibilidadRamal2Component},
 {path: 'popup-calendario-disp', component:PopupCalendarioDispComponent},
 {path: 'popup-novedad-agregar', component:PopupNovedadAgregarComponent},
 {path: 'popup-ddjj-cf', component:PopupDdjjCfComponent},
 {path: 'popup-ddjj-cf-edit', component:PopupDdjjCfEditComponent},



 {path: 'cronograma-new', component:CronogramaNewComponent},








 {path: 'prueba-territorio', component:PruebaTerritorioComponent},
 {path: 'prueba-form', component:PruebaFormComponent},
 {path: 'prueba-form2', component:PruebaForm2Component},
 {path: 'prueba-detail', component:PruebaDetailComponent},




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
