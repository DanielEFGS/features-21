import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { TextureLayerDirective } from '../../../shared/texture-layer/texture-layer.directive';

@Component({
  selector: 'app-labs-feature-page',
  imports: [RouterLink, TextureLayerDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './labs-feature-page.html',
  styleUrl: './labs-feature-page.css'
})
export class LabsFeaturePage {
  private readonly route = inject(ActivatedRoute);
  protected readonly feature = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('feature') ?? '')),
    { initialValue: '' }
  );
}
