import { TestBed } from '@angular/core/testing';

import { AuntService } from './aunt.service';

describe('AuntService', () => {
  let service: AuntService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuntService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
