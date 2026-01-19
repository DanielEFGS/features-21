import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import * as axe from 'axe-core';

import { HomePage } from './home-page';

describe('HomePage accessibility', () => {
  it('has no WCAG A/AA violations', async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    await fixture.whenStable();

    const results = await axe.run(fixture.nativeElement, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
    });

    expect(results.violations).toHaveLength(0);
  });
});
