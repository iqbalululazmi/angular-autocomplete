import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutocompleteDirective } from './directives/autocomplete.directive';
import { AutocompleteListComponent } from './components/autocomplete-list/autocomplete-list.component';
import { AutocompleteContainerComponent } from './components/autocomplete-list/autocomplete-container.component';

@NgModule({
  declarations: [
    AppComponent,
    AutocompleteDirective,
    AutocompleteListComponent,
    AutocompleteContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  exports: [
    AutocompleteDirective,
    AutocompleteListComponent,
    AutocompleteContainerComponent
  ],
  entryComponents: [
    AutocompleteListComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [  
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
