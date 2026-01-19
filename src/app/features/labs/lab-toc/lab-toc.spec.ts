import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

import { LabToc } from './lab-toc';

describe('LabToc', () => {
  it('uses the first section title as the default active label', async () => {
    const fragment$ = new BehaviorSubject<string>('');

    await TestBed.configureTestingModule({
      imports: [LabToc],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { fragment: fragment$.asObservable() } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabToc);
    fixture.componentRef.setInput('sections', [
      { id: 'overview', title: 'Overview' },
      { id: 'setup', title: 'Setup' }
    ]);
    fixture.detectChanges();

    expect(fixture.componentInstance.activeLabel()).toBe('Overview');
    fragment$.complete();
  });

  it('updates the active id from the router fragment', async () => {
    const fragment$ = new BehaviorSubject<string>('overview');

    await TestBed.configureTestingModule({
      imports: [LabToc],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { fragment: fragment$.asObservable() } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabToc);
    fixture.componentRef.setInput('sections', [
      { id: 'overview', title: 'Overview' },
      { id: 'setup', title: 'Setup' }
    ]);
    fixture.detectChanges();

    fragment$.next('setup');
    fixture.detectChanges();

    expect(fixture.componentInstance.activeId()).toBe('setup');
    fragment$.complete();
  });

  it('falls back to the default label when sections are missing', async () => {
    const fragment$ = new BehaviorSubject<string>('');

    await TestBed.configureTestingModule({
      imports: [LabToc],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { fragment: fragment$.asObservable() } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabToc);
    fixture.componentRef.setInput('sections', []);
    fixture.detectChanges();

    expect(fixture.componentInstance.activeLabel()).toBe('On this page');
    fragment$.complete();
  });

  it('keeps the mobile state closed when toggled on desktop', async () => {
    const fragment$ = new BehaviorSubject<string>('');

    await TestBed.configureTestingModule({
      imports: [LabToc],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { fragment: fragment$.asObservable() } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabToc);
    fixture.componentRef.setInput('sections', [{ id: 'overview', title: 'Overview' }]);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      isDesktop: { set: (value: boolean) => void; (): boolean };
      isOpen: { (): boolean };
      onToggle: (event: Event) => void;
    };

    component.isDesktop.set(true);
    component.onToggle({ target: document.createElement('details') } as unknown as Event);

    expect(component.isOpen()).toBe(false);
    fragment$.complete();
  });

  it('tracks the toggle state on mobile', async () => {
    const fragment$ = new BehaviorSubject<string>('');

    await TestBed.configureTestingModule({
      imports: [LabToc],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { fragment: fragment$.asObservable() } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabToc);
    fixture.componentRef.setInput('sections', [{ id: 'overview', title: 'Overview' }]);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      isDesktop: { set: (value: boolean) => void };
      isOpen: { (): boolean };
      onToggle: (event: Event) => void;
    };

    component.isDesktop.set(false);

    const details = document.createElement('details');
    details.open = true;
    component.onToggle({ target: details } as unknown as Event);

    expect(component.isOpen()).toBe(true);
    fragment$.complete();
  });

  it('updates the active section when running with media queries', async () => {
    const fragment$ = new BehaviorSubject<string>('');
    if (typeof window.matchMedia !== 'function') {
      Object.defineProperty(window, 'matchMedia', { value: vi.fn(), configurable: true });
    }
    const matchMediaSpy = vi
      .spyOn(window, 'matchMedia')
      .mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      } as unknown as MediaQueryList);
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      });

    const first = document.createElement('section');
    first.id = 'overview';
    first.getBoundingClientRect = () => ({ top: -20 } as DOMRect);
    document.body.appendChild(first);

    const second = document.createElement('section');
    second.id = 'setup';
    second.getBoundingClientRect = () => ({ top: 200 } as DOMRect);
    document.body.appendChild(second);

    await TestBed.configureTestingModule({
      imports: [LabToc],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { fragment: fragment$.asObservable() } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabToc);
    fixture.componentRef.setInput('sections', [
      { id: 'overview', title: 'Overview' },
      { id: 'setup', title: 'Setup' }
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.activeId()).toBe('overview');

    document.body.removeChild(first);
    document.body.removeChild(second);
    matchMediaSpy.mockRestore();
    rafSpy.mockRestore();
    fragment$.complete();
  });
});
