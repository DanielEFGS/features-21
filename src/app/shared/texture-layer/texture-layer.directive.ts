import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  inject,
  numberAttribute
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appTextureLayer]'
})
export class TextureLayerDirective implements OnInit, OnDestroy {
  /** Opacity for the diagonal texture layer (0-1). */
  @Input({ transform: numberAttribute }) textureDiagonalOpacity = 1;
  /** Opacity for the noise texture layer (0-1). */
  @Input({ transform: numberAttribute }) textureNoiseOpacity = 0.68;

  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);

  private diagonalLayer?: HTMLElement;
  private noiseLayer?: HTMLElement;

  /**
   * Adds texture layers as the first children of the host element.
   * @returns void
   */
  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const host = this.hostRef.nativeElement;
    if (host.querySelector(':scope > .panel-texture')) {
      return;
    }

    this.renderer.addClass(host, 'paper-texture-host');

    this.diagonalLayer = this.renderer.createElement('div');
    this.renderer.addClass(this.diagonalLayer, 'panel-texture');
    this.renderer.addClass(this.diagonalLayer, 'panel-texture-diagonal');
    this.renderer.setStyle(this.diagonalLayer, 'opacity', `${this.textureDiagonalOpacity}`);

    this.noiseLayer = this.renderer.createElement('div');
    this.renderer.addClass(this.noiseLayer, 'panel-texture');
    this.renderer.addClass(this.noiseLayer, 'panel-texture-noise');
    this.renderer.setStyle(this.noiseLayer, 'opacity', `${this.textureNoiseOpacity}`);

    this.renderer.insertBefore(host, this.noiseLayer, host.firstChild);
    this.renderer.insertBefore(host, this.diagonalLayer, this.noiseLayer);
  }

  /**
   * Removes texture layers when the directive is destroyed.
   * @returns void
   */
  ngOnDestroy(): void {
    if (this.diagonalLayer) {
      this.renderer.removeChild(this.hostRef.nativeElement, this.diagonalLayer);
    }

    if (this.noiseLayer) {
      this.renderer.removeChild(this.hostRef.nativeElement, this.noiseLayer);
    }
  }
}
