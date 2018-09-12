/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AlertityService } from './alertity.service';

describe('Service: Alertity', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertityService]
    });
  });

  it('should ...', inject([AlertityService], (service: AlertityService) => {
    expect(service).toBeTruthy();
  }));
});
