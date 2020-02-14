import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocorrectListComponent } from './autocorrect-list.component';

describe('AutocorrectListComponent', () => {
  let component: AutocorrectListComponent;
  let fixture: ComponentFixture<AutocorrectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocorrectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocorrectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
