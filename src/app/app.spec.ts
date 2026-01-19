import { Component } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { afterEach, vi } from 'vitest';
import { App } from './app';

@Component({
  selector: 'app-dummy',
  template: ''
})
class DummyComponent {}

describe('App', () => {
  afterEach(() => {
    delete (window as Window & { HSSelect?: unknown }).HSSelect;
    delete (window as Window & { HSStaticMethods?: unknown }).HSStaticMethods;
    vi.useRealTimers();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([{ path: '', component: DummyComponent }])]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render primary navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav')?.textContent).toContain('Pokedex');
  });

  it('closes the mobile menu when clicking the backdrop', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('details.nav-menu') as HTMLDetailsElement;
    const backdrop = fixture.nativeElement.querySelector('.nav-menu-backdrop') as HTMLButtonElement;

    menu.setAttribute('open', '');
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(menu.hasAttribute('open')).toBe(false);
  });

  it('closes the menu and active selects on Escape', () => {
    const closeCurrentlyOpened = vi.fn();
    (window as Window & { HSSelect?: { closeCurrentlyOpened: (target?: HTMLElement) => void } }).HSSelect = {
      closeCurrentlyOpened
    };

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('details.nav-menu') as HTMLDetailsElement;
    menu.setAttribute('open', '');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(menu.hasAttribute('open')).toBe(false);
    expect(closeCurrentlyOpened).toHaveBeenCalledWith(undefined);
  });

  it('ignores non-escape key presses', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('details.nav-menu') as HTMLDetailsElement;
    menu.setAttribute('open', '');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(menu.hasAttribute('open')).toBe(true);
  });

  it('keeps the menu open when clicking inside the menu panel', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('details.nav-menu') as HTMLDetailsElement;
    const panel = fixture.nativeElement.querySelector('.nav-menu-panel') as HTMLElement;

    menu.setAttribute('open', '');
    panel.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(menu.hasAttribute('open')).toBe(true);
  });

  it('closes active selects on outside clicks', () => {
    const closeCurrentlyOpened = vi.fn();
    (window as Window & { HSSelect?: { closeCurrentlyOpened: (target?: HTMLElement) => void } }).HSSelect = {
      closeCurrentlyOpened
    };

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(closeCurrentlyOpened).toHaveBeenCalledWith(outside);
    document.body.removeChild(outside);
  });

  it('handles outside clicks without active selects', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    document.body.removeChild(outside);
  });

  it('ignores document clicks with a null target', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as { handleDocumentClick: (event: MouseEvent) => void };
    component.handleDocumentClick({ target: null } as unknown as MouseEvent);
  });

  it('ignores document clicks when the menu is missing', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('details.nav-menu') as HTMLDetailsElement | null;
    menu?.remove();

    const component = fixture.componentInstance as unknown as { handleDocumentClick: (event: MouseEvent) => void };
    component.handleDocumentClick({ target: document.body } as unknown as MouseEvent);
  });

  it('initializes Preline after navigation ends', async () => {
    vi.useFakeTimers();
    const autoInit = vi.fn();
    const windowRef = window as unknown as { HSStaticMethods?: { autoInit: () => void } };
    windowRef.HSStaticMethods = { autoInit: autoInit as () => void };

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/');
    vi.runAllTimers();

    expect(autoInit).toHaveBeenCalled();
  });

  it('skips browser-only logic on the server', async () => {
    await TestBed.resetTestingModule().configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([{ path: '', component: DummyComponent }]),
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as { subscriptions: Array<unknown> };
    expect(component['subscriptions'].length).toBe(0);
  });
});
