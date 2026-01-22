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
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LabSection } from '../labs.models';

const ON_PUSH = ChangeDetectionStrategy.OnPush;

@Component({
  selector: 'app-lab-toc',
  changeDetection: ON_PUSH,
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
  readonly pendingTargetId = signal<string | null>(null);
  readonly pendingUntil = signal(0);
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

      const updateActive = () => {
        const offset = this.isDesktop() ? 120 : 140;
        const elements = this.sections()
          .map((section) => this.document.getElementById(section.id))
          .filter((element): element is HTMLElement => Boolean(element));
        const scrollY = win.scrollY + offset;
        let currentId = elements[0]?.id ?? '';
        const pendingId = this.pendingTargetId();
        if (pendingId) {
          if (Date.now() > this.pendingUntil()) {
            this.pendingTargetId.set(null);
          } else {
            const target = elements.find((element) => element.id === pendingId);
            if (target) {
              const targetTop = target.getBoundingClientRect().top + win.scrollY;
              if (scrollY >= targetTop) {
                this.activeId.set(pendingId);
                this.pendingTargetId.set(null);
              }
              return;
            }
            this.pendingTargetId.set(null);
          }
        }

        for (const element of elements) {
          const top = element.getBoundingClientRect().top + win.scrollY;
          if (top <= scrollY) {
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

  /**
   * Closes the TOC on mobile.
   */
  closeToc(): void {
    if (this.isDesktop()) {
      return;
    }
    this.isOpen.set(false);
  }

  /**
   * Closes the TOC when a section link is clicked on mobile.
   * @param event Link click event.
   */
  onLinkClick(event: Event, sectionId: string): void {
    event.preventDefault();
    if (!this.isDesktop()) {
      const target = event.currentTarget as HTMLElement | null;
      const details = target?.closest('details');
      if (details && 'open' in details) {
        (details as HTMLDetailsElement).open = false;
      }
      this.isOpen.set(false);
    }
    this.pendingTargetId.set(sectionId);
    this.pendingUntil.set(Date.now() + 900);
    this.scrollToSection(sectionId);
    this.updateHash(sectionId);
  }

  /**
   * Offsets anchor scrolling to account for sticky UI on mobile.
   */
  private scrollToSection(sectionId: string): void {
    const win = this.document.defaultView;
    if (!win) {
      return;
    }
    const offset = this.isDesktop() ? 95 : 120;
    const getTarget = () => this.document.getElementById(sectionId);
    let attempts = 0;
    const scroller = this.document.scrollingElement ?? this.document.documentElement;

    const scroll = () => {
      const target = getTarget();
      if (!target) {
        attempts += 1;
        if (attempts < 4) {
          win.setTimeout(scroll, 50);
        }
        return;
      }
      const top = target.getBoundingClientRect().top + (scroller?.scrollTop ?? win.scrollY) - offset;
      if (scroller) {
        scroller.scrollTo({ top, behavior: 'smooth' });
      } else {
        win.scrollTo({ top, behavior: 'smooth' });
      }
    };

    scroll();
  }

  /**
   * Updates the URL hash without triggering navigation.
   * @param sectionId Section anchor id.
   */
  private updateHash(sectionId: string): void {
    const win = this.document.defaultView;
    if (!win) {
      return;
    }
    const base = win.location.href.split('#')[0];
    win.history.replaceState({}, '', `${base}#${sectionId}`);
  }
}
