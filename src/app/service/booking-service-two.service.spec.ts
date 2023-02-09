import { TestBed } from '@angular/core/testing';

import { BookingServiceTwoService } from './booking-service-two.service';

describe('BookingServiceTwoService', () => {
  let service: BookingServiceTwoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingServiceTwoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
