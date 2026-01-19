import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import * as axe from 'axe-core';
import { of } from 'rxjs';

import { LabsFeaturePage } from './labs-feature-page';

describe('LabsFeaturePage accessibility', () => {
  it('has no WCAG A/AA violations on the signals lab', async () => {
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

    const fixture = TestBed.createComponent(LabsFeaturePage);
    fixture.detectChanges();
    await fixture.whenStable();

    const results = await axe.run(fixture.nativeElement, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
    });

    expect(results.violations).toHaveLength(0);
  });
});
