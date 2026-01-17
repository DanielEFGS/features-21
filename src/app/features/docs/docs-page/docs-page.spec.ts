import { TestBed } from '@angular/core/testing';

import { DocsPage } from './docs-page';

describe('DocsPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsPage]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DocsPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
