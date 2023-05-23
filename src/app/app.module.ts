import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfsessionalFormComponent } from './components/profsessional-form/profsessional-form.component';
import { SearchPopupComponent } from './components/search-popup/search-popup.component';
import { LeftNavbarComponent  } from './components/left-navbar/left-navbar.component';
import { RightNavbarComponent } from './components/right-navbar/right-navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ProfsessionalFormComponent,
    SearchPopupComponent,
    LeftNavbarComponent,
    RightNavbarComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
