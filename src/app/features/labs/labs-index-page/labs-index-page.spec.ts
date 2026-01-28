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

  it('renders a card for each lab entry', async () => {
    const fixture = TestBed.createComponent(LabsIndexPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.lab-card');
    expect(cards.length).toBe(LAB_CATALOG.length);
  });

  it('shows status styles only for labs that are not done', async () => {
    const fixture = TestBed.createComponent(LabsIndexPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const statusNodes = Array.from(fixture.nativeElement.querySelectorAll('.lab-status')) as Element[];
    const extraNodes = statusNodes.filter((node) => node.classList.contains('lab-status--extra'));
    const nonDoneStatusNodes = statusNodes.filter((node) => !node.classList.contains('lab-status--extra'));

    const nonDoneCount = LAB_CATALOG.filter((item) => item.status !== 'done').length;
    const extraCount = LAB_CATALOG.filter((item) => item.extra).length;

    expect(nonDoneStatusNodes.length).toBe(nonDoneCount);
    expect(extraNodes.length).toBe(extraCount);
  });

  it('hides status labels for completed labs', () => {
    const fixture = TestBed.createComponent(LabsIndexPage);
    fixture.detectChanges();

    const doneStatus = fixture.nativeElement.querySelector('.lab-status--done');
    expect(doneStatus).toBeNull();
  });
});
