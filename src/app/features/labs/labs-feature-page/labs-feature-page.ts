import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { LabExerciseComponent } from '../lab-exercise/lab-exercise';
import { LabHero } from '../lab-hero/lab-hero';
import { LabReferencesComponent } from '../lab-references/lab-references';
import { LabSectionComponent } from '../lab-section/lab-section';
import { LabToc } from '../lab-toc/lab-toc';
import { LAB_CATALOG, LAB_CONTENT } from '../labs.data';
import { LabCodeDemoComponent, LabCodeTab } from '../lab-code-demo/lab-code-demo';
import { SignalsDemoComponent } from '../signals-demo/signals-demo';
import { SIGNALS_DEMO_CODE } from '../signals-demo/signals-demo.code';
import { TextureLayerDirective } from '../../../shared/texture-layer/texture-layer.directive';

@Component({
  selector: 'app-labs-feature-page',
  imports: [
    TextureLayerDirective,
    LabHero,
    LabToc,
    LabSectionComponent,
    LabExerciseComponent,
    LabReferencesComponent,
    LabCodeDemoComponent,
    SignalsDemoComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './labs-feature-page.html',
  styleUrl: './labs-feature-page.css'
})
export class LabsFeaturePage {
  private readonly route = inject(ActivatedRoute);
  protected readonly featureId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('feature') ?? '')),
    { initialValue: '' }
  );

  protected readonly lab = computed(() => LAB_CONTENT[this.featureId()] ?? null);
  protected readonly catalogItem = computed(
    () => LAB_CATALOG.find((item) => item.id === this.featureId()) ?? null
  );
  protected readonly sections = computed(() => this.lab()?.sections ?? []);
  protected readonly tocSections = computed(() => {
    const mainSections = this.lab()?.sections ?? [];
    const demoSection = this.lab()?.id === 'signals' ? [{ id: 'demo', title: 'Demo' }] : [];
    return [
      ...mainSections,
      ...demoSection,
      { id: 'exercise', title: 'Exercise' },
      { id: 'references', title: 'References' }
    ];
  });

  protected readonly signalsDemoTabs: LabCodeTab[] = [
    { id: 'html', label: 'HTML', language: 'markup', code: SIGNALS_DEMO_CODE.html },
    { id: 'ts', label: 'TypeScript', language: 'ts', code: SIGNALS_DEMO_CODE.ts },
    { id: 'css', label: 'CSS', language: 'css', code: SIGNALS_DEMO_CODE.css }
  ];
}
