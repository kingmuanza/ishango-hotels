import { TestBed } from '@angular/core/testing';

import { RepasService } from './repas.service';

describe('RepasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RepasService = TestBed.get(RepasService);
    expect(service).toBeTruthy();
  });
});
