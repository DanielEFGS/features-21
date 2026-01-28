import { ChangeDetectionStrategy, Component, LOCALE_ID, computed, inject } from '@angular/core';
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
import { AnimationsDemoComponent } from '../demos/animations-demo/animations-demo';
import { StyleGuideDemoComponent } from '../demos/style-guide-demo/style-guide-demo';
import { TailwindDemoComponent } from '../demos/tailwind-demo/tailwind-demo';
import { A11yAriaDemoComponent } from '../demos/a11y-aria-demo/a11y-aria-demo';
import { PwaDemoComponent } from '../demos/pwa-demo/pwa-demo';
import { TestingDemoComponent } from '../demos/testing-demo/testing-demo';
import { PerformanceDemoComponent } from '../demos/performance-demo/performance-demo';
import { CustomBuildDemoComponent } from '../demos/custom-build-demo/custom-build-demo';
import { CdkDemoComponent } from '../demos/cdk-demo/cdk-demo';
import { DI_DEMO_CODE } from '../demos/di-demo/di-demo.code';
import { SIGNALS_DEMO_CODE } from '../demos/signals-demo/signals-demo.code';
import { HTTPRESOURCE_DEMO_CODE } from '../demos/httpresource-demo/httpresource-demo.code';
import { RXJS_INTEROP_DEMO_CODE } from '../demos/rxjs-interop-demo/rxjs-interop-demo.code';
import { ROUTING_DEMO_CODE } from '../demos/routing-demo/routing-demo.code';
import { FORMS_DEMO_CODE } from '../demos/forms-demo/forms-demo.code';
import { ANIMATIONS_DEMO_CODE } from '../demos/animations-demo/animations-demo.code';
import { STYLE_GUIDE_DEMO_CODE } from '../demos/style-guide-demo/style-guide-demo.code';
import { TAILWIND_DEMO_CODE } from '../demos/tailwind-demo/tailwind-demo.code';
import { A11Y_ARIA_DEMO_CODE } from '../demos/a11y-aria-demo/a11y-aria-demo.code';
import { PWA_DEMO_CODE } from '../demos/pwa-demo/pwa-demo.code';
import { TESTING_DEMO_CODE } from '../demos/testing-demo/testing-demo.code';
import { PERFORMANCE_DEMO_CODE } from '../demos/performance-demo/performance-demo.code';
import { CUSTOM_BUILD_DEMO_CODE } from '../demos/custom-build-demo/custom-build-demo.code';
import { CDK_DEMO_CODE } from '../demos/cdk-demo/cdk-demo.code';

import { TextureLayerDirective } from '../../../shared/texture-layer/texture-layer.directive';
import { localizeCatalogItem, localizeLabContent } from '../labs.i18n';

@Component({
  selector: 'app-labs-feature-page',
  imports: [
    TextureLayerDirective,
    LabToc,
    LabHero,
    LabSectionComponent,
    LabExerciseComponent,
    LabCodeDemoComponent,
    LabReferencesComponent,
    DiDemoComponent,
    FormsDemoComponent,
    RoutingDemoComponent,
    SignalsDemoComponent,
    AnimationsDemoComponent,
    RxjsInteropDemoComponent,
    HttpResourceDemoComponent,
    StyleGuideDemoComponent,
    TailwindDemoComponent,
    A11yAriaDemoComponent,
    PwaDemoComponent,
    TestingDemoComponent,
    PerformanceDemoComponent,
    CustomBuildDemoComponent,
    CdkDemoComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './labs-feature-page.html',
  styleUrl: './labs-feature-page.css'
})
export class LabsFeaturePage {
  private readonly route = inject(ActivatedRoute);
  private readonly locale = inject(LOCALE_ID);
  protected readonly featureId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('feature') ?? '')),
    { initialValue: '' }
  );

  protected readonly lab = computed(() =>
    localizeLabContent(LAB_CONTENT[this.featureId()], this.locale)
  );
  protected readonly catalogItem = computed(() =>
    localizeCatalogItem(LAB_CATALOG.find((item) => item.id === this.featureId()) ?? null, this.locale)
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
      this.lab()?.id === 'forms' ||
      this.lab()?.id === 'animations' ||
      this.lab()?.id === 'style-guide' ||
      this.lab()?.id === 'tailwind' ||
      this.lab()?.id === 'a11y-aria' ||
      this.lab()?.id === 'pwa' ||
      this.lab()?.id === 'testing' ||
      this.lab()?.id === 'performance' ||
      this.lab()?.id === 'custom-build' ||
      this.lab()?.id === 'cdk'
        ? [{ id: 'demo', title: $localize`:@@labTocDemo:Demo` }]
        : [];
    return [
      ...mainSections,
      ...demoSection,
      { id: 'exercise', title: $localize`:@@labTocExercise:Exercise` },
      { id: 'references', title: $localize`:@@labTocReferences:References` }
    ];
  });

  protected readonly signalsDemoTabs: LabCodeTab[] = [
    { id: 'html', label: $localize`:@@labTabHtml:HTML`, language: 'markup', code: SIGNALS_DEMO_CODE.html },
    { id: 'ts', label: $localize`:@@labTabTs:TypeScript`, language: 'ts', code: SIGNALS_DEMO_CODE.ts },
    { id: 'css', label: $localize`:@@labTabCss:CSS`, language: 'css', code: SIGNALS_DEMO_CODE.css }
  ];

  protected readonly httpResourceDemoTabs: LabCodeTab[] = [
    { id: 'html', label: $localize`:@@labTabHtml:HTML`, language: 'html', code: HTTPRESOURCE_DEMO_CODE.html },
    { id: 'ts', label: $localize`:@@labTabTs:TypeScript`, language: 'ts', code: HTTPRESOURCE_DEMO_CODE.ts },
    { id: 'css', label: $localize`:@@labTabCss:CSS`, language: 'css', code: HTTPRESOURCE_DEMO_CODE.css }
  ];

  protected readonly rxjsInteropDemoTabs: LabCodeTab[] = [
    { id: 'html', label: $localize`:@@labTabHtml:HTML`, language: 'html', code: RXJS_INTEROP_DEMO_CODE.html },
    { id: 'ts', label: $localize`:@@labTabTs:TypeScript`, language: 'ts', code: RXJS_INTEROP_DEMO_CODE.ts },
    { id: 'css', label: $localize`:@@labTabCss:CSS`, language: 'css', code: RXJS_INTEROP_DEMO_CODE.css }
  ];

  protected readonly routingDemoTabs: LabCodeTab[] = [
    { id: 'html', label: $localize`:@@labTabHtml:HTML`, language: 'html', code: ROUTING_DEMO_CODE.html },
    { id: 'ts', label: $localize`:@@labTabTs:TypeScript`, language: 'ts', code: ROUTING_DEMO_CODE.ts },
    { id: 'css', label: $localize`:@@labTabCss:CSS`, language: 'css', code: ROUTING_DEMO_CODE.css }
  ];

  protected readonly diDemoTabs: LabCodeTab[] = [
    { id: 'html', label: $localize`:@@labTabHtml:HTML`, language: 'html', code: DI_DEMO_CODE.html },
    { id: 'ts', label: $localize`:@@labTabTs:TypeScript`, language: 'ts', code: DI_DEMO_CODE.ts },
    { id: 'css', label: $localize`:@@labTabCss:CSS`, language: 'css', code: DI_DEMO_CODE.css }
  ];

  protected readonly formsDemoTabs: LabCodeTab[] = [
    { id: 'html', label: $localize`:@@labTabHtml:HTML`, language: 'html', code: FORMS_DEMO_CODE.html },
    { id: 'ts', label: $localize`:@@labTabTs:TypeScript`, language: 'ts', code: FORMS_DEMO_CODE.ts },
    { id: 'css', label: $localize`:@@labTabCss:CSS`, language: 'css', code: FORMS_DEMO_CODE.css }
  ];

  protected readonly animationsDemoTabs: LabCodeTab[] = [
    { id: 'html', label: $localize`:@@labTabHtml:HTML`, language: 'html', code: ANIMATIONS_DEMO_CODE.html },
    { id: 'ts', label: $localize`:@@labTabTs:TypeScript`, language: 'ts', code: ANIMATIONS_DEMO_CODE.ts },
    { id: 'css', label: $localize`:@@labTabCss:CSS`, language: 'css', code: ANIMATIONS_DEMO_CODE.css }
  ];

  protected readonly styleGuideDemoTabs: LabCodeTab[] = [
    { id: 'html', label: $localize`:@@labTabHtml:HTML`, language: 'html', code: STYLE_GUIDE_DEMO_CODE.html },
    { id: 'ts', label: $localize`:@@labTabTs:TypeScript`, language: 'ts', code: STYLE_GUIDE_DEMO_CODE.ts },
    { id: 'css', label: $localize`:@@labTabCss:CSS`, language: 'css', code: STYLE_GUIDE_DEMO_CODE.css }
  ];

  protected readonly tailwindDemoTabs: LabCodeTab[] = [
    { id: 'html', label: $localize`:@@labTabHtml:HTML`, language: 'html', code: TAILWIND_DEMO_CODE.html },
    { id: 'ts', label: $localize`:@@labTabTs:TypeScript`, language: 'ts', code: TAILWIND_DEMO_CODE.ts },
    { id: 'css', label: $localize`:@@labTabCss:CSS`, language: 'css', code: TAILWIND_DEMO_CODE.css }
  ];

  protected readonly a11yAriaDemoTabs: LabCodeTab[] = [
    { id: 'html', label: $localize`:@@labTabHtml:HTML`, language: 'html', code: A11Y_ARIA_DEMO_CODE.html },
    { id: 'ts', label: $localize`:@@labTabTs:TypeScript`, language: 'ts', code: A11Y_ARIA_DEMO_CODE.ts },
    { id: 'css', label: $localize`:@@labTabCss:CSS`, language: 'css', code: A11Y_ARIA_DEMO_CODE.css }
  ];

  protected readonly pwaDemoTabs: LabCodeTab[] = [
    { id: 'html', label: $localize`:@@labTabHtml:HTML`, language: 'html', code: PWA_DEMO_CODE.html },
    { id: 'ts', label: $localize`:@@labTabTs:TypeScript`, language: 'ts', code: PWA_DEMO_CODE.ts },
    { id: 'css', label: $localize`:@@labTabCss:CSS`, language: 'css', code: PWA_DEMO_CODE.css }
  ];

  protected readonly testingDemoTabs: LabCodeTab[] = [
    { id: 'html', label: $localize`:@@labTabHtml:HTML`, language: 'html', code: TESTING_DEMO_CODE.html },
    { id: 'ts', label: $localize`:@@labTabTs:TypeScript`, language: 'ts', code: TESTING_DEMO_CODE.ts },
    { id: 'css', label: $localize`:@@labTabCss:CSS`, language: 'css', code: TESTING_DEMO_CODE.css }
  ];

  protected readonly performanceDemoTabs: LabCodeTab[] = [
    { id: 'html', label: $localize`:@@labTabHtml:HTML`, language: 'html', code: PERFORMANCE_DEMO_CODE.html },
    { id: 'ts', label: $localize`:@@labTabTs:TypeScript`, language: 'ts', code: PERFORMANCE_DEMO_CODE.ts },
    { id: 'css', label: $localize`:@@labTabCss:CSS`, language: 'css', code: PERFORMANCE_DEMO_CODE.css }
  ];

  protected readonly customBuildDemoTabs: LabCodeTab[] = [
    { id: 'html', label: $localize`:@@labTabHtml:HTML`, language: 'html', code: CUSTOM_BUILD_DEMO_CODE.html },
    { id: 'ts', label: $localize`:@@labTabTs:TypeScript`, language: 'ts', code: CUSTOM_BUILD_DEMO_CODE.ts },
    { id: 'css', label: $localize`:@@labTabCss:CSS`, language: 'css', code: CUSTOM_BUILD_DEMO_CODE.css }
  ];

  protected readonly cdkDemoTabs: LabCodeTab[] = [
    { id: 'html', label: $localize`:@@labTabHtml:HTML`, language: 'html', code: CDK_DEMO_CODE.html },
    { id: 'ts', label: $localize`:@@labTabTs:TypeScript`, language: 'ts', code: CDK_DEMO_CODE.ts },
    { id: 'css', label: $localize`:@@labTabCss:CSS`, language: 'css', code: CDK_DEMO_CODE.css }
  ];
}
