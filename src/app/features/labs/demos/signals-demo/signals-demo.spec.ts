import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { SignalsDemoComponent } from './signals-demo';

describe('SignalsDemoComponent', () => {
  it('tracks selection and derived state', async () => {
    await TestBed.configureTestingModule({
      imports: [SignalsDemoComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(SignalsDemoComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.selectedCount()).toBe(0);
    expect(component.isLimitReached()).toBe(false);
    expect(component.summaryText()).toBe('Selected: 0/3');

    component.add('Pikachu');
    component.add('Bulbasaur');
    component.add('Charmander');
    component.add('Squirtle');
    component.add('Pikachu');

    expect(component.selectedCount()).toBe(3);
    expect(component.isLimitReached()).toBe(true);
    expect(component.selectedDetails().length).toBe(3);

    component.remove('Bulbasaur');
    expect(component.selectedCount()).toBe(2);

    component.clear();
    expect(component.selectedCount()).toBe(0);
  });

  it('persists selection changes to session storage', async () => {
    await TestBed.configureTestingModule({
      imports: [SignalsDemoComponent]
    }).compileComponents();

    const storageStub = {
      length: 0,
      clear: vi.fn(),
      getItem: vi.fn(),
      key: vi.fn(),
      removeItem: vi.fn(),
      setItem: vi.fn()
    };
    Object.defineProperty(window, 'sessionStorage', {
      value: storageStub,
      configurable: true
    });
    const setItem = vi.spyOn(window.sessionStorage, 'setItem');
    const fixture = TestBed.createComponent(SignalsDemoComponent);
    fixture.detectChanges();

    fixture.componentInstance.add('Pikachu');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(
      setItem.mock.calls.some((call) => call[1] === JSON.stringify(['Pikachu']))
    ).toBe(true);
  });

  it('does not crash when sessionStorage is unavailable', async () => {
    await TestBed.configureTestingModule({
      imports: [SignalsDemoComponent]
    }).compileComponents();

    Object.defineProperty(window, 'sessionStorage', {
      value: undefined,
      configurable: true
    });

    const fixture = TestBed.createComponent(SignalsDemoComponent);
    fixture.detectChanges();

    expect(() => fixture.componentInstance.add('Pikachu')).not.toThrow();
  });
});
