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

  it('defaults the feature name when the param is missing', async () => {
    await TestBed.configureTestingModule({
      imports: [LabsFeaturePage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({}))
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabsFeaturePage);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as { featureId: () => string };
    expect(component.featureId()).toBe('');
  });

  it('maps known features to lab content', () => {
    const fixture = TestBed.createComponent(LabsFeaturePage);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as { lab: () => unknown };
    expect(component.lab()).toBeTruthy();
  });
});
