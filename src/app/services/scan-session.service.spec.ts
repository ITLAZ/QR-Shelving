import { TestBed } from '@angular/core/testing';

import { ScanSessionService } from './scan-session.service';

describe('ScanSessionService', () => {
  let service: ScanSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScanSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
