import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementEditComponent } from './paiement-edit.component';

describe('PaiementEditComponent', () => {
  let component: PaiementEditComponent;
  let fixture: ComponentFixture<PaiementEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaiementEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaiementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
