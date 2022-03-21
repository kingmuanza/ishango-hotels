import { TestBed } from '@angular/core/testing';

import { RepasReservationService } from './repas-reservation.service';

describe('RepasReservationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RepasReservationService = TestBed.get(RepasReservationService);
    expect(service).toBeTruthy();
  });
});
