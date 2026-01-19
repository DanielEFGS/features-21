import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { LabCodeDemoComponent, LabCodeTab } from './lab-code-demo';

describe('LabCodeDemoComponent', () => {
  it('defaults to the first tab when none is selected', async () => {
    await TestBed.configureTestingModule({
      imports: [LabCodeDemoComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabCodeDemoComponent);
    const tabs: LabCodeTab[] = [
      { id: 'html', label: 'HTML', language: 'html', code: '<div></div>' },
      { id: 'ts', label: 'TS', language: 'ts', code: 'const demo = true;' }
    ];

    fixture.componentRef.setInput('demoId', 'signals-quick-compare');
    fixture.componentRef.setInput('sectionId', 'demo');
    fixture.componentRef.setInput('title', 'Signals demo');
    fixture.componentRef.setInput('tabs', tabs);
    fixture.detectChanges();

    expect(fixture.componentInstance.activeTabId()).toBe('html');
  });

  it('selects a tab and generates ids for tabs and panels', async () => {
    await TestBed.configureTestingModule({
      imports: [LabCodeDemoComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabCodeDemoComponent);
    const tabs: LabCodeTab[] = [
      { id: 'html', label: 'HTML', language: 'html', code: '<div></div>' },
      { id: 'css', label: 'CSS', language: 'css', code: '.demo {}' }
    ];

    fixture.componentRef.setInput('demoId', 'signals-demo');
    fixture.componentRef.setInput('title', 'Signals demo');
    fixture.componentRef.setInput('tabs', tabs);
    fixture.detectChanges();

    fixture.componentInstance.selectTab('css');
    fixture.detectChanges();

    expect(fixture.componentInstance.activeTabId()).toBe('css');
    expect(fixture.componentInstance.tabId(tabs[0])).toBe('signals-demo-tab-html');
    expect(fixture.componentInstance.panelId(tabs[0])).toBe('signals-demo-panel-html');
  });

  it('maps language classes for known aliases', async () => {
    await TestBed.configureTestingModule({
      imports: [LabCodeDemoComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabCodeDemoComponent);
    const tabs: LabCodeTab[] = [
      { id: 'html', label: 'HTML', language: 'html', code: '<div></div>' },
      { id: 'ts', label: 'TS', language: 'ts', code: 'const demo = true;' },
      { id: 'css', label: 'CSS', language: 'css', code: '.demo {}' }
    ];

    fixture.componentRef.setInput('demoId', 'signals-demo');
    fixture.componentRef.setInput('title', 'Signals demo');
    fixture.componentRef.setInput('tabs', tabs);
    fixture.detectChanges();

    expect(fixture.componentInstance.languageClass(tabs[0])).toBe('language-markup');
    expect(fixture.componentInstance.languageClass(tabs[1])).toBe('language-typescript');
    expect(fixture.componentInstance.languageClass(tabs[2])).toBe('language-css');
  });

  it('renders the empty state when no tabs are supplied', async () => {
    await TestBed.configureTestingModule({
      imports: [LabCodeDemoComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabCodeDemoComponent);

    fixture.componentRef.setInput('demoId', 'signals-demo');
    fixture.componentRef.setInput('title', 'Signals demo');
    fixture.componentRef.setInput('tabs', []);
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('.empty');
    expect(empty?.textContent).toContain('No code available yet.');
  });

  it('no-ops highlighting when the active tab is missing', async () => {
    await TestBed.configureTestingModule({
      imports: [LabCodeDemoComponent]
    }).compileComponents();

    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      });

    const fixture = TestBed.createComponent(LabCodeDemoComponent);
    const tabs: LabCodeTab[] = [{ id: 'html', label: 'HTML', language: 'html', code: '<div></div>' }];

    fixture.componentRef.setInput('demoId', 'signals-demo');
    fixture.componentRef.setInput('title', 'Signals demo');
    fixture.componentRef.setInput('tabs', tabs);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      activeTabId: { set: (value: string) => void };
      highlightCode: () => void;
    };

    component.activeTabId.set('missing');
    component.highlightCode();

    rafSpy.mockRestore();
  });

  it('skips highlighting when the code panel is missing', async () => {
    await TestBed.configureTestingModule({
      imports: [LabCodeDemoComponent]
    }).compileComponents();

    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      });

    const fixture = TestBed.createComponent(LabCodeDemoComponent);
    const tabs: LabCodeTab[] = [{ id: 'html', label: 'HTML', language: 'html', code: '<div></div>' }];

    fixture.componentRef.setInput('demoId', 'signals-demo');
    fixture.componentRef.setInput('title', 'Signals demo');
    fixture.componentRef.setInput('tabs', tabs);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('code')?.remove();

    const component = fixture.componentInstance as unknown as { highlightCode: () => void };
    component.highlightCode();

    rafSpy.mockRestore();
  });
});
