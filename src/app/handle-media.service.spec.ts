import { TestBed } from '@angular/core/testing';

import { HandleMediaService } from './handle-media.service';

describe('HandleMediaService', () => {
  let service: HandleMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleMediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
