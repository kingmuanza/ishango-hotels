import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChambreListComponent } from './chambre-list.component';

describe('ChambreListComponent', () => {
  let component: ChambreListComponent;
  let fixture: ComponentFixture<ChambreListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChambreListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChambreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
