import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChambreEditComponent } from './chambre-edit.component';

describe('ChambreEditComponent', () => {
  let component: ChambreEditComponent;
  let fixture: ComponentFixture<ChambreEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChambreEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChambreEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
