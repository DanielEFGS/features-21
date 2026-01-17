import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LabsIndexPage } from './labs-index-page';

describe('LabsIndexPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabsIndexPage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LabsIndexPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
