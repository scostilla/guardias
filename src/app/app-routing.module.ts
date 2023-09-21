import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { DailyScheduleComponent } from './components/daily-schedule/daily-schedule.component';
import { DdjjCargoyagrupTotComponent } from './components/ddjj-cargoyagrup-tot/ddjj-cargoyagrup-tot.component';
import { DdjjCargoyagrupTotalApComponent } from './components/ddjj-cargoyagrup-total-ap/ddjj-cargoyagrup-total-ap.component';
import { DdjjCargoyagrupTotalRecComponent } from './components/ddjj-cargoyagrup-total-rec/ddjj-cargoyagrup-total-rec.component';
import { DdjjCargoyagrupComponent } from './components/ddjj-cargoyagrup/ddjj-cargoyagrup.component';
import { DdjjContrafacturaTotApComponent } from './components/ddjj-contrafactura-tot-ap/ddjj-contrafactura-tot-ap.component';
import { DdjjContrafacturaTotRecComponent } from './components/ddjj-contrafactura-tot-rec/ddjj-contrafactura-tot-rec.component';
import { DdjjContrafacturaTotComponent } from './components/ddjj-contrafactura-tot/ddjj-contrafactura-tot.component';
import { DdjjContrafacturaComponent } from './components/ddjj-contrafactura/ddjj-contrafactura.component';
import { DdjjExtraTotApComponent } from './components/ddjj-extra-tot-ap/ddjj-extra-tot-ap.component';
import { DdjjExtraTotRecComponent } from './components/ddjj-extra-tot-rec/ddjj-extra-tot-rec.component';
import { DdjjExtraTotComponent } from './components/ddjj-extra-tot/ddjj-extra-tot.component';
import { DdjjExtraComponent } from './components/ddjj-extra/ddjj-extra.component';
import { DdjjTentativoComponent } from './components/ddjj-tentativo/ddjj-tentativo.component';
import { DigestoComponent } from './components/digesto/digesto.component';
import { DisponibilidadComponent } from './components/disponibilidad/disponibilidad.component';
import { DistHorariaConsComponent } from './components/dist-horaria-cons/dist-horaria-cons.component';
import { DistHorariaGirasComponent } from './components/dist-horaria-giras/dist-horaria-giras.component';
import { DistHorariaGuardiaComponent } from './components/dist-horaria-guardia/dist-horaria-guardia.component';
import { DistHorariaOtrasComponent } from './components/dist-horaria-otras/dist-horaria-otras.component';
import { DistHorariaComponent } from './components/dist-horaria/dist-horaria.component';
import { GuardiaActivaComponent } from './components/guardia-activa/guardia-activa.component';
import { GuardiaPasivaComponent } from './components/guardia-pasiva/guardia-pasiva.component';
import { MonthTableComponent } from './components/month-table/month-table.component';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { PopupCalendarioDispComponent } from './components/popup-calendario-disp/popup-calendario-disp.component';
import { PopupCalendarioComponent } from './components/popup-calendario/popup-calendario.component';
import { PopupDdjjCfEditComponent } from './components/popup-ddjj-cf-edit/popup-ddjj-cf-edit.component';
import { PopupDdjjCfComponent } from './components/popup-ddjj-cf/popup-ddjj-cf.component';
import { PopupNovedadAgregarComponent } from './components/popup-novedad-agregar/popup-novedad-agregar.component';
import { ProfessionalDetailComponent } from './components/professional-detail/professional-detail.component';
import { ProfessionalDhHistComponent } from './components/professional-dh-hist/professional-dh-hist.component';
import { ProfessionalDhJunioComponent } from './components/professional-dh-junio/professional-dh-junio.component';
import { ProfessionalDhComponent } from './components/professional-dh/professional-dh.component';
import { ProfessionalFormDeletComponent } from './components/professional-form-delet/professional-form-delet.component';
import { ProfessionalFormEditComponent } from './components/professional-form-edit/professional-form-edit.component';
import { ProfessionalPlantillaDhComponent } from './components/professional-plantilla-dh/professional-plantilla-dh.component';

import { ProfessionalFormComponent } from './components/professional-form/professional-form.component';
import { ProfessionalListComponent } from './components/professional-list/professional-list.component';
import { ProfessionalNewsComponent } from './components/professional-news/professional-news.component';
import { RegistroActividadesComponent } from './components/registro-actividades/registro-actividades.component';
import { RegistroDiarioComponent } from './components/registro-diario/registro-diario.component';
import { ScheduleDistributionComponent } from './components/schedule-distribution/schedule-distribution.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'professional-form', component: ProfessionalFormComponent },
  { path: 'professional-form-edit', component: ProfessionalFormEditComponent },
  { path: 'professional-form-delet', component: ProfessionalFormDeletComponent },
  { path: 'daily-schedule', component: DailyScheduleComponent},
  {path:"home-page", component:HomePageComponent},
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
 {path:'cronograma-definitivo', component:CronogramaDefinitivoComponent},
 {path:'cronograma-tentativo', component:CronogramaTentativoComponent},
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
 {path: 'historial', component:HistorialComponent},
 {path: 'disponibilidad', component:DisponibilidadComponent},
 {path: 'popup-calendario-disp', component:PopupCalendarioDispComponent},
 {path: 'popup-novedad-agregar', component:PopupNovedadAgregarComponent},
 {path: 'popup-ddjj-cf', component:PopupDdjjCfComponent},
 {path: 'popup-ddjj-cf-edit', component:PopupDdjjCfEditComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
