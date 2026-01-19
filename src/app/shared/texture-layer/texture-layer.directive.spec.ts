import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { TextureLayerDirective } from './texture-layer.directive';

@Component({
  selector: 'app-texture-host',
  imports: [TextureLayerDirective],
  template: '<div id="host" appTextureLayer [textureDiagonalOpacity]="0.5" [textureNoiseOpacity]="0.2"></div>'
})
class TextureHostComponent {}

describe('TextureLayerDirective', () => {
  it('adds texture layers in the browser', async () => {
    await TestBed.configureTestingModule({
      imports: [TextureHostComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(TextureHostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('#host') as HTMLElement;
    const layers = host.querySelectorAll('.panel-texture');

    expect(host.classList.contains('paper-texture-host')).toBe(true);
    expect(layers.length).toBe(2);
    expect(layers[0]?.classList.contains('panel-texture-diagonal')).toBe(true);
    expect(layers[1]?.classList.contains('panel-texture-noise')).toBe(true);
    expect((layers[0] as HTMLElement).style.opacity).toBe('0.5');
    expect((layers[1] as HTMLElement).style.opacity).toBe('0.2');

    fixture.destroy();
    expect(host.querySelectorAll('.panel-texture').length).toBe(0);
  });

  it('does not add layers on the server', async () => {
    await TestBed.configureTestingModule({
      imports: [TextureHostComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }]
    }).compileComponents();

    const fixture = TestBed.createComponent(TextureHostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('#host') as HTMLElement;
    expect(host.classList.contains('paper-texture-host')).toBe(false);
    expect(host.querySelectorAll('.panel-texture').length).toBe(0);
  });
});
