import { TestBed } from '@angular/core/testing';

import { LabSectionComponent } from './lab-section';

describe('LabSectionComponent', () => {
  it('renders optional content blocks when provided', async () => {
    await TestBed.configureTestingModule({
      imports: [LabSectionComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabSectionComponent);
    fixture.componentRef.setInput('section', {
      id: 'core-apis',
      title: 'Core APIs',
      summary: 'Signals and computed drive local state.',
      paragraphs: ['First paragraph.'],
      bullets: ['One', 'Two'],
      steps: ['Step one', 'Step two'],
      callouts: [
        { tone: 'note', title: 'Note', text: 'A note.' },
        { tone: 'tip', title: 'Tip', text: 'A tip.' },
        { tone: 'warn', title: 'Warn', text: 'A warning.' }
      ],
      code: [
        { title: 'Example', language: 'ts', snippet: 'const value = 1;' },
        { language: 'html', snippet: '<div></div>' },
        { snippet: 'const fallback = true;' }
      ]
    });
    fixture.detectChanges();

    const summary = fixture.nativeElement.querySelector('.summary');
    expect(summary?.textContent).toContain('Signals and computed');

    expect(fixture.nativeElement.querySelectorAll('.bullets li').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('.steps li').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('.callout').length).toBe(3);
    expect(fixture.nativeElement.querySelector('.callout--note')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.callout--tip')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.callout--warn')).not.toBeNull();

    const codeBlocks = fixture.nativeElement.querySelectorAll('.code-block');
    expect(codeBlocks.length).toBe(3);
    expect(codeBlocks[0]?.querySelector('pre')?.className).toContain('language-typescript');
    expect(codeBlocks[1]?.querySelector('pre')?.className).toContain('language-markup');
    expect(codeBlocks[2]?.querySelector('pre')?.className).toContain('language-markup');
  });

  it('skips optional blocks when data is missing', async () => {
    await TestBed.configureTestingModule({
      imports: [LabSectionComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabSectionComponent);
    fixture.componentRef.setInput('section', {
      id: 'overview',
      title: 'Overview'
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.summary')).toBeNull();
    expect(fixture.nativeElement.querySelector('.bullets')).toBeNull();
    expect(fixture.nativeElement.querySelector('.steps')).toBeNull();
    expect(fixture.nativeElement.querySelector('.callouts')).toBeNull();
    expect(fixture.nativeElement.querySelector('.code-blocks')).toBeNull();
  });
});
