import { TestBed } from '@angular/core/testing';

import { FirestoreService } from './firestore-service.service';

describe('FirestoreServiceService', () => {
  let service: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
