import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUtilisateurComponent } from './info-utilisateur.component';

describe('InfoUtilisateurComponent', () => {
  let component: InfoUtilisateurComponent;
  let fixture: ComponentFixture<InfoUtilisateurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUtilisateurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
