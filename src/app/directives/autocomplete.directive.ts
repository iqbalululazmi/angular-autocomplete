import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  Output,
  ViewContainerRef
} from '@angular/core';
import getCaretCoordinates from 'textarea-caret';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AutocompleteListComponent } from "../components/autocomplete-list/autocomplete-list.component";


export interface ChoiceSelectedEvent {
  choice: any;
  insertedAt: {
    start: number;
    end: number;
  };
}

@Directive({
  selector:
    'textarea[formulaAutoComplete], input[formulaAutoComplete], ion-input[formulaAutoComplete]'
})
export class AutocompleteDirective implements OnDestroy {
  /**
   * The character that will trigger the menu to appear
   */
  @Input() triggerCharacter = '@';

  /**
   * The regular expression that will match the search text after the trigger character
   */
  @Input() searchRegexp = /^\w*$/;

  /**
   * Whether to close the menu when the host textarea loses focus
   */
  @Input() closeMenuOnBlur = false;

  /**
   * The menu component to show with available options.
   * You can extend the built in `AutocompleteListComponent` component to use a custom template
   */
  @Input() menuComponent = AutocompleteListComponent;

  /**
   * Called when the options menu is shown
   */
  @Output() menuShown = new EventEmitter();

  /**
   * Called when the options menu is hidden
   */
  @Output() menuHidden = new EventEmitter();

  /**
   * Called when a choice is selected
   */
  @Output() choiceSelected = new EventEmitter<ChoiceSelectedEvent>();

  /**
   * A function that accepts a search string and returns an array of choices. Can also return a promise.
   */
  @Input() findChoices: (searchText: string) => any[];

  /**
   * A function that formats the selected choice once selected.
   */
  @Input() getChoiceLabel: (choice: any) => string = choice => choice;

  /* tslint:disable member-ordering */
  private menu:
    | {
        component: ComponentRef<AutocompleteListComponent>;
        triggerCharacterPosition: number;
        lastCaretPosition?: number;
      }
    | undefined;

  private menuHidden$ = new Subject();
  private formulaList$:any = []
  private formulaListTmp$

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    private elm: ElementRef
  ) {  }

  @HostListener('keypress', ['$event.key'])
  onKeypress(key: string) {
    if (key === this.triggerCharacter) {
      this.showMenu();
    }
  }

  @HostListener('input', ['$event.target.value'])
  onChange(value: string) {
    if (this.menu) {
      if (value[this.menu.triggerCharacterPosition] !== this.triggerCharacter) {
        this.hideMenu();
      } else {
        const cursor = this.elm.nativeElement.selectionStart;
        if (cursor < this.menu.triggerCharacterPosition) {
          this.hideMenu();
        } else {
          const searchText = value.slice(
            this.menu.triggerCharacterPosition + 1,
            cursor
          );

          console.log(searchText);
          
          if (!searchText.match(this.searchRegexp)) {
            this.hideMenu();
          } else {
            this.menu.component.instance.searchText = searchText;
            this.menu.component.instance.choices = [];
            this.menu.component.instance.choiceLoadError = undefined;
            this.menu.component.instance.choiceLoading = true;
            this.menu.component.changeDetectorRef.detectChanges();
            Promise.resolve(this.findChoicesx(searchText))
              .then(choices => {
                if (this.menu) {
                  this.menu.component.instance.choices = choices;
                  this.menu.component.instance.choiceLoading = false;
                  this.menu.component.changeDetectorRef.detectChanges();
                }
              })
              .catch(err => {
                if (this.menu) {
                  this.menu.component.instance.choiceLoading = false;
                  this.menu.component.instance.choiceLoadError = err;
                  this.menu.component.changeDetectorRef.detectChanges();
                }
              });
          }
        }
      }
    }
  }

  //Using for auto complete, filtering array
  private findChoicesx(searchText: string) {
    let formulaList$ = [
      'Iqbal Ulul Azmi',
      'Richard Andreas',
      'Ferdinand Sinaga',
      'Thomas Alfa Edison',
      'Edward Pramono',
      'Aji Sasongko'
    ]
    
    return formulaList$
      .filter(item => item.toLowerCase().includes(searchText.toLowerCase()))
      .slice(0, 5);
  }

  @HostListener('blur')
  onBlur() {
    if (this.menu) {
      this.menu.lastCaretPosition = this.elm.nativeElement.selectionStart;

      if (this.closeMenuOnBlur === true) {
        this.hideMenu();
      }
    }
  }

  private showMenu() {
    if (!this.menu) {
      const menuFactory = this.componentFactoryResolver.resolveComponentFactory<
        AutocompleteListComponent
      >(this.menuComponent);
      this.menu = {
        component: this.viewContainerRef.createComponent(
          menuFactory,
          0,
          this.injector
        ),
        triggerCharacterPosition: this.elm.nativeElement.selectionStart
      };
      const lineHeight = +getComputedStyle(
        this.elm.nativeElement
      ).lineHeight!.replace(/px$/, '');
      const { top, left } = getCaretCoordinates(
        this.elm.nativeElement,
        this.elm.nativeElement.selectionStart
      );
      this.menu.component.instance.position = {
        top: top + lineHeight,
        left
      };
      this.menu.component.changeDetectorRef.detectChanges();
      this.menu.component.instance.selectChoice
        .pipe(takeUntil(this.menuHidden$))
        .subscribe(choice => {
          const label = this.getChoiceLabel(choice);
          const textarea: HTMLTextAreaElement = this.elm.nativeElement;
          const value: string = textarea.value;
          const startIndex = this.menu!.triggerCharacterPosition;
          const start = value.slice(0, startIndex);
          const caretPosition =
            this.menu!.lastCaretPosition || textarea.selectionStart;
          const end = value.slice(caretPosition);
          textarea.value = start + label + end;
          // force ng model / form control to update
          textarea.dispatchEvent(new Event('input'));
          this.hideMenu();
          const setCursorAt = (start + label).length;
          textarea.setSelectionRange(setCursorAt, setCursorAt);
          textarea.focus();
          this.choiceSelected.emit({
            choice,
            insertedAt: {
              start: startIndex,
              end: startIndex + label.length
            }
          });
        });
      this.menuShown.emit();
    }
  }

  private hideMenu() {
    if (this.menu) {
      this.menu.component.destroy();
      this.menuHidden$.next();
      this.menuHidden.emit();
      this.menu = undefined;
    }
  }

  ngOnDestroy() {
    this.hideMenu();
  }
}