import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LAB_CATALOG } from '../labs.data';
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

  it('renders a card for each lab entry', () => {
    const fixture = TestBed.createComponent(LabsIndexPage);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.lab-card');
    expect(cards.length).toBe(LAB_CATALOG.length);
  });

  it('shows status styles for planned and in-progress labs', () => {
    const fixture = TestBed.createComponent(LabsIndexPage);
    fixture.detectChanges();

    const statusNodes = Array.from(fixture.nativeElement.querySelectorAll('.lab-status')) as Element[];
    const statusClasses = statusNodes.map((node) => node.className);

    expect(statusClasses.some((value: string) => value.includes('lab-status--planned'))).toBe(true);
    expect(statusClasses.some((value: string) => value.includes('lab-status--progress'))).toBe(true);
  });
});
