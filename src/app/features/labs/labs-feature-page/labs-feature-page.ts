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
import { HttpResourceDemoComponent } from '../demos/httpresource-demo/httpresource-demo';
import { DiDemoComponent } from '../demos/di-demo/di-demo';
import { RxjsInteropDemoComponent } from '../demos/rxjs-interop-demo/rxjs-interop-demo';
import { RoutingDemoComponent } from '../demos/routing-demo/routing-demo';
import { SignalsDemoComponent } from '../demos/signals-demo/signals-demo';
import { FormsDemoComponent } from '../demos/forms-demo/forms-demo';
import { DI_DEMO_CODE } from '../demos/di-demo/di-demo.code';
import { SIGNALS_DEMO_CODE } from '../demos/signals-demo/signals-demo.code';
import { HTTPRESOURCE_DEMO_CODE } from '../demos/httpresource-demo/httpresource-demo.code';
import { RXJS_INTEROP_DEMO_CODE } from '../demos/rxjs-interop-demo/rxjs-interop-demo.code';
import { ROUTING_DEMO_CODE } from '../demos/routing-demo/routing-demo.code';
import { FORMS_DEMO_CODE } from '../demos/forms-demo/forms-demo.code';
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
    HttpResourceDemoComponent,
    DiDemoComponent,
    RxjsInteropDemoComponent,
    RoutingDemoComponent,
    SignalsDemoComponent,
    FormsDemoComponent
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
    const demoSection =
      this.lab()?.id === 'signals' ||
      this.lab()?.id === 'httpresource' ||
      this.lab()?.id === 'rxjs-interop' ||
      this.lab()?.id === 'routing' ||
      this.lab()?.id === 'di' ||
      this.lab()?.id === 'forms'
        ? [{ id: 'demo', title: 'Demo' }]
        : [];
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

  protected readonly httpResourceDemoTabs: LabCodeTab[] = [
    { id: 'html', label: 'HTML', language: 'html', code: HTTPRESOURCE_DEMO_CODE.html },
    { id: 'ts', label: 'TypeScript', language: 'ts', code: HTTPRESOURCE_DEMO_CODE.ts },
    { id: 'css', label: 'CSS', language: 'css', code: HTTPRESOURCE_DEMO_CODE.css }
  ];

  protected readonly rxjsInteropDemoTabs: LabCodeTab[] = [
    { id: 'html', label: 'HTML', language: 'html', code: RXJS_INTEROP_DEMO_CODE.html },
    { id: 'ts', label: 'TypeScript', language: 'ts', code: RXJS_INTEROP_DEMO_CODE.ts },
    { id: 'css', label: 'CSS', language: 'css', code: RXJS_INTEROP_DEMO_CODE.css }
  ];

  protected readonly routingDemoTabs: LabCodeTab[] = [
    { id: 'html', label: 'HTML', language: 'html', code: ROUTING_DEMO_CODE.html },
    { id: 'ts', label: 'TypeScript', language: 'ts', code: ROUTING_DEMO_CODE.ts },
    { id: 'css', label: 'CSS', language: 'css', code: ROUTING_DEMO_CODE.css }
  ];

  protected readonly diDemoTabs: LabCodeTab[] = [
    { id: 'html', label: 'HTML', language: 'html', code: DI_DEMO_CODE.html },
    { id: 'ts', label: 'TypeScript', language: 'ts', code: DI_DEMO_CODE.ts },
    { id: 'css', label: 'CSS', language: 'css', code: DI_DEMO_CODE.css }
  ];

  protected readonly formsDemoTabs: LabCodeTab[] = [
    { id: 'html', label: 'HTML', language: 'html', code: FORMS_DEMO_CODE.html },
    { id: 'ts', label: 'TypeScript', language: 'ts', code: FORMS_DEMO_CODE.ts },
    { id: 'css', label: 'CSS', language: 'css', code: FORMS_DEMO_CODE.css }
  ];
}
