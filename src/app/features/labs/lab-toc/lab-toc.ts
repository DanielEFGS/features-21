import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { LabSection } from '../labs.models';

@Component({
  selector: 'app-lab-toc',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lab-toc.html',
  styleUrl: './lab-toc.css'
})
/**
 * Sticky table of contents for lab sections.
 */
export class LabToc {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);
  readonly sections = input.required<LabSection[]>();

  private readonly fragment = toSignal(this.route.fragment ?? of(''), { initialValue: '' });
  readonly activeId = signal('');
  readonly isOpen = signal(false);
  readonly isDesktop = signal(false);

  readonly activeLabel = computed(() => {
    const sections = this.sections();
    const match = sections.find((section) => section.id === this.activeId());
    return match?.title ?? sections[0]?.title ?? 'On this page';
  });

  constructor() {
    effect(() => {
      const fragment = this.fragment();
      if (fragment) {
        this.activeId.set(fragment);
      }
    });

    afterNextRender(() => {
      const win = this.document.defaultView;
      if (!win) return;

      if (typeof win.matchMedia !== 'function') {
        return;
      }

      const mediaQuery = win.matchMedia('(min-width: 901px)');
      const updateViewport = () => {
        const desktop = mediaQuery.matches;
        this.isDesktop.set(desktop);
        if (desktop) {
          this.isOpen.set(true);
        }
      };
      updateViewport();
      mediaQuery.addEventListener('change', updateViewport);

      const elements = this.sections()
        .map((section) => this.document.getElementById(section.id))
        .filter((element): element is HTMLElement => Boolean(element));

      const updateActive = () => {
        const offset = 120;
        let currentId = elements[0]?.id ?? '';

        for (const element of elements) {
          const rect = element.getBoundingClientRect();
          if (rect.top - offset <= 0) {
            currentId = element.id;
          } else {
            break;
          }
        }

        if (currentId) {
          this.activeId.set(currentId);
        }
      };

      const onScroll = () => {
        win.requestAnimationFrame(updateActive);
      };

      updateActive();
      win.addEventListener('scroll', onScroll, { passive: true });
      win.addEventListener('resize', onScroll, { passive: true });

      this.destroyRef.onDestroy(() => {
        win.removeEventListener('scroll', onScroll);
        win.removeEventListener('resize', onScroll);
        mediaQuery.removeEventListener('change', updateViewport);
      });
    });
  }

  /**
   * Tracks open/closed state for the mobile collapsible TOC.
   * @param event Details toggle event.
   */
  onToggle(event: Event): void {
    if (this.isDesktop()) {
      return;
    }
    const target = event.target as HTMLDetailsElement | null;
    if (!target) return;
    this.isOpen.set(target.open);
  }
}
