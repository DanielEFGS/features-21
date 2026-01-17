import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TextureLayerDirective } from '../../../shared/texture-layer/texture-layer.directive';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, TextureLayerDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {}
