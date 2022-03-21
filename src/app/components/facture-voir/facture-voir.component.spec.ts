import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureVoirComponent } from './facture-voir.component';

describe('FactureVoirComponent', () => {
  let component: FactureVoirComponent;
  let fixture: ComponentFixture<FactureVoirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactureVoirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureVoirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
