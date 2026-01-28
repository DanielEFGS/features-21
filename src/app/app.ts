import { Component, ElementRef, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LOCALE_ID, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, fromEvent } from 'rxjs';
import { TextureLayerDirective } from './shared/texture-layer/texture-layer.directive';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TextureLayerDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly localeId = inject(LOCALE_ID);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly subscriptions: Array<{ unsubscribe: () => void }> = [];

  readonly currentLocale = signal<'es' | 'en'>(this.detectLocale());
  readonly localeMenuOpen = signal(false);
  readonly localeOptions = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' }
  ] as const;
  readonly currentLocaleLabel = computed(() => this.currentLocale().toUpperCase());

  /**
   * Reinitializes Preline UI components after navigation completes.
   */
  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    document.documentElement.lang = this.currentLocale();

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => window.HSStaticMethods?.autoInit(), 100);
      });

    const clickSub = fromEvent<MouseEvent>(document, 'click').subscribe((event) =>
      this.handleDocumentClick(event)
    );
    const keySub = fromEvent<KeyboardEvent>(document, 'keydown').subscribe((event) =>
      this.handleDocumentKeydown(event)
    );
    this.subscriptions.push(clickSub, keySub);
  }

  /**
   * Cleans up document listeners on destroy.
   */
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Closes the header menu when clicking outside or on a menu link.
   *
   * @param event - Document click event.
   */
  private handleDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }

    const menu = this.host.nativeElement.querySelector('details.nav-menu');
    const localeMenu = this.host.nativeElement.querySelector('.locale-menu-panel');
    const localeTrigger = this.host.nativeElement.querySelector('.locale-trigger');

    if (menu && menu.contains(target)) {
      if (target.closest('.menu-toggle')) {
        this.closeLocaleMenu();
      }
      if (target.closest('.nav-menu-backdrop') || target.closest('.nav-menu-panel a')) {
        menu.removeAttribute('open');
      }
      return;
    }

    if (menu?.hasAttribute('open')) {
      menu.removeAttribute('open');
    }

    if (
      this.localeMenuOpen() &&
      localeMenu &&
      localeTrigger &&
      !localeMenu.contains(target) &&
      !localeTrigger.contains(target)
    ) {
      this.closeLocaleMenu();
    }

    if (localeTrigger && localeTrigger.contains(target)) {
      this.closeNavMenu();
    }

    this.closeActiveSelects(target);
  }

  /**
   * Closes the header menu with Escape.
   *
   * @param event - Document keydown event.
   */
  private handleDocumentKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') {
      return;
    }

    const menu = this.host.nativeElement.querySelector('details.nav-menu');
    if (menu?.hasAttribute('open')) {
      menu.removeAttribute('open');
    }

    if (this.localeMenuOpen()) {
      this.closeLocaleMenu();
    }

    this.closeActiveSelects();
  }

  /**
   * Closes any active Preline select dropdowns.
   *
   * @param target - Optional click target for scoped closing.
   */
  private closeActiveSelects(target?: HTMLElement | EventTarget | null) {
    const hsSelect = (window as Window & { HSSelect?: { closeCurrentlyOpened: (el?: HTMLElement) => void } }).HSSelect;
    if (!hsSelect) {
      return;
    }

    const scopedTarget = target instanceof HTMLElement ? target : undefined;

    try {
      hsSelect.closeCurrentlyOpened(scopedTarget);
    } catch {
      // Some HS implementations throw if target is null/invalid; swallow to avoid breaking navigation.
    }
  }

  toggleLocaleMenu(): void {
    if (!this.localeMenuOpen()) {
      this.closeNavMenu();
    }
    this.localeMenuOpen.update((open) => !open);
  }

  closeLocaleMenu(): void {
    this.localeMenuOpen.set(false);
  }

  chooseLocale(locale: 'es' | 'en'): void {
    if (locale === this.currentLocale()) {
      this.closeLocaleMenu();
      return;
    }

    this.persistLocale(locale);
    this.reloadForLocale(locale);
  }

  private detectLocale(): 'es' | 'en' {
    if (isPlatformBrowser(this.platformId)) {
      const htmlLang = document.documentElement.lang;
      if (htmlLang) {
        return this.normalizeLocale(htmlLang);
      }

      const stored = localStorage.getItem('app-locale');
      if (stored) {
        return this.normalizeLocale(stored);
      }

      const navLang = navigator.language || navigator.languages?.[0];
      if (navLang) {
        return this.normalizeLocale(navLang);
      }
    }

    return this.normalizeLocale(this.localeId ?? 'es');
  }

  private normalizeLocale(value: string): 'es' | 'en' {
    return value.toLowerCase().startsWith('en') ? 'en' : 'es';
  }

  private persistLocale(locale: 'es' | 'en'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    try {
      localStorage.setItem('app-locale', locale);
    } catch {
      // ignore storage issues (private mode, etc.)
    }
  }

  private reloadForLocale(locale: 'es' | 'en'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const nextHref = this.buildLocaleHref(locale);
    this.localeMenuOpen.set(false);
    window.location.href = nextHref;
  }

  private buildLocaleHref(locale: 'es' | 'en'): string {
    const { pathname, search, hash } = window.location;
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'es' || segments[0] === 'en') {
      segments[0] = locale;
      return `/${segments.join('/')}${search}${hash}`;
    }

    if (locale === 'es') {
      return `${pathname}${search}${hash}`;
    }
    return `/${locale}${pathname}${search}${hash}`;
  }

  onNavMenuToggle(event: Event): void {
    const details = event.target as HTMLDetailsElement | null;
    if (details?.open) {
      this.closeLocaleMenu();
    }
    if (!details?.open) {
      this.closeActiveSelects();
    }
  }

  private closeNavMenu(): void {
    const menu = this.host.nativeElement.querySelector('details.nav-menu');
    menu?.removeAttribute('open');
  }
}
