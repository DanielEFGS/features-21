import { Component, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
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
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly subscriptions: Array<{ unsubscribe: () => void }> = [];

  /**
   * Reinitializes Preline UI components after navigation completes.
   */
  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
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
    if (!menu) {
      return;
    }

    if (menu.contains(target)) {
      if (target.closest('.nav-menu-backdrop') || target.closest('.nav-menu-panel a')) {
        menu.removeAttribute('open');
      }
      return;
    }

    if (menu.hasAttribute('open')) {
      menu.removeAttribute('open');
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

    this.closeActiveSelects();
  }

  /**
   * Closes any active Preline select dropdowns.
   *
   * @param target - Optional click target for scoped closing.
   */
  private closeActiveSelects(target?: HTMLElement) {
    const hsSelect = (window as Window & { HSSelect?: { closeCurrentlyOpened: (el?: HTMLElement) => void } })
      .HSSelect;
    if (!hsSelect) {
      return;
    }
    hsSelect.closeCurrentlyOpened(target ?? undefined);
  }
}
