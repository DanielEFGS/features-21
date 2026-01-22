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

  it('adds the demo section for the signals lab', () => {
    const fixture = TestBed.createComponent(LabsFeaturePage);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      tocSections: () => Array<{ id: string }>;
    };
    expect(component.tocSections().some((section) => section.id === 'demo')).toBe(true);
  });

  it('omits the demo section when the lab is missing', async () => {
    await TestBed.configureTestingModule({
      imports: [LabsFeaturePage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ feature: 'missing-lab' }))
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabsFeaturePage);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      lab: () => unknown;
      tocSections: () => Array<{ id: string }>;
    };

    expect(component.lab()).toBeNull();
    expect(component.tocSections().some((section) => section.id === 'demo')).toBe(false);
  });
});
