import { Component } from '@angular/core';

@Component({
  selector: 'formula-auto-complete',
  styles: [
    `
    :host {
      position: relative;
      display: block;
    }
  `
  ],
  template: '<ng-content></ng-content>'
})
export class AutocompleteContainerComponent {}