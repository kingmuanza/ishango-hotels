import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepasEditComponent } from './repas-edit.component';

describe('RepasEditComponent', () => {
  let component: RepasEditComponent;
  let fixture: ComponentFixture<RepasEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepasEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
