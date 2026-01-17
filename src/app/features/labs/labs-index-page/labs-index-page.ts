import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TextureLayerDirective } from '../../../shared/texture-layer/texture-layer.directive';

@Component({
  selector: 'app-labs-index-page',
  imports: [RouterLink, TextureLayerDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './labs-index-page.html',
  styleUrl: './labs-index-page.css'
})
export class LabsIndexPage {}
