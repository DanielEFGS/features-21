import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';

/**
 * Tab metadata for the demo code viewer.
 */
export type LabCodeTab = {
  id: string;
  label: string;
  language: string;
  code: string;
};

/**
 * Renders a read-only demo with preview and code tabs.
 */
@Component({
  selector: 'app-lab-code-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lab-code-demo.html',
  styleUrl: './lab-code-demo.css'
})
export class LabCodeDemoComponent {
  private readonly document = inject(DOCUMENT);
  /** Optional anchor id to link from the table of contents. */
  readonly sectionId = input<string>('');
  readonly demoId = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly tabs = input.required<LabCodeTab[]>();

  readonly activeTabId = signal('');
  readonly hostId = computed(() => this.sectionId() || this.demoId());

  constructor() {
    effect(() => {
      const tabs = this.tabs();
      if (!tabs.length) return;
      if (!tabs.some((tab) => tab.id === this.activeTabId())) {
        this.activeTabId.set(tabs[0].id);
      }
    });

    effect(() => {
      this.activeTabId();
      this.highlightCode();
    });

    afterNextRender(() => {
      this.highlightCode();
    });

  }

  /**
   * Activates the requested tab id.
   * @param id Tab identifier.
   */
  selectTab(id: string): void {
    this.activeTabId.set(id);
  }

  /**
   * Resolves the Prism language class for a tab.
   * @param tab Lab tab descriptor.
   * @returns Language class name.
   */
  languageClass(tab: LabCodeTab): string {
    const languageMap: Record<string, string> = {
      html: 'markup',
      ts: 'typescript'
    };
    const language = languageMap[tab.language] ?? tab.language;
    return `language-${language}`;
  }

  /**
   * Creates the unique id for a tab trigger.
   * @param tab Lab tab descriptor.
   * @returns DOM id for the tab trigger.
   */
  tabId(tab: LabCodeTab): string {
    return `${this.demoId()}-tab-${tab.id}`;
  }

  /**
   * Creates the unique id for a tab panel.
   * @param tab Lab tab descriptor.
   * @returns DOM id for the tab panel.
   */
  panelId(tab: LabCodeTab): string {
    return `${this.demoId()}-panel-${tab.id}`;
  }

  /**
   * Applies syntax highlighting to the active code block.
   */
  private highlightCode(): void {
    if (typeof Prism === 'undefined') return;
    const win = this.document.defaultView;
    if (!win) return;

    win.requestAnimationFrame(() => {
      const activeTab = this.tabs().find((tab) => tab.id === this.activeTabId()) ?? null;
      if (!activeTab) return;
      const host = this.document.getElementById(this.hostId());
      if (!host) return;
      const panel = host.querySelector(`#${this.panelId(activeTab)} code`) as HTMLElement | null;
      if (panel) {
        Prism.highlightElement(panel);
      }
    });
  }
}
