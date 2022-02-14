import { TestBed } from '@angular/core/testing';

import { ChambreService } from './chambre.service';

describe('ChambreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChambreService = TestBed.get(ChambreService);
    expect(service).toBeTruthy();
  });
});
