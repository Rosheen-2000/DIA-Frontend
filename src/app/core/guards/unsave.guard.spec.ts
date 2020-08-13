import { TestBed } from '@angular/core/testing';

import { UnsaveGuard } from './unsave.guard';

describe('UnsaveGuard', () => {
  let guard: UnsaveGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UnsaveGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
