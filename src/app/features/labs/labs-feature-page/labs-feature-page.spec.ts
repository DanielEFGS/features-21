import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { LabsFeaturePage } from './labs-feature-page';

describe('LabsFeaturePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabsFeaturePage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ feature: 'signals' }))
          }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LabsFeaturePage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
