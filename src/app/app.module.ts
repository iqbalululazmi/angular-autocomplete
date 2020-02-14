import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutocorrectDirective } from './autocorrect.directive';
import { AutocorrectListComponent } from './autocorrect-list/autocorrect-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AutocorrectDirective,
    AutocorrectListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
