import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal
} from '@angular/core';
import {
  outputFromObservable,
  outputToObservable,
  takeUntilDestroyed,
  toObservable,
  toSignal
} from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged, filter, map, scan } from 'rxjs';

/**
 * Read-only demo used in the RxJS interop lab.
 */
@Component({
  selector: 'app-rxjs-interop-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rxjs-interop-demo.html',
  styleUrl: './rxjs-interop-demo.css'
})
export class RxjsInteropDemoComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly input$ = new Subject<string>();
  private readonly applyClicks$ = new Subject<string>();

  readonly liveInput = signal('');

  readonly query = toSignal(this.input$.pipe(debounceTime(300), distinctUntilChanged()), {
    initialValue: ''
  });

  readonly normalizedQuery$ = toObservable(this.query).pipe(
    map((value) => value.trim().toLowerCase())
  );
  readonly normalizedQuery = toSignal(this.normalizedQuery$, { initialValue: '' });

  readonly applied = outputFromObservable(this.applyClicks$);
  readonly applied$ = outputToObservable(this.applied);

  readonly appliedCount = signal(0);
  readonly appliedLog = toSignal(
    this.applied$.pipe(
      map((value) => value.trim()),
      filter((value) => value.length > 0),
      scan((entries, value) => [value, ...entries].slice(0, 5), [] as string[])
    ),
    { initialValue: [] }
  );

  readonly isApplyDisabled = computed(() => this.liveInput().trim().length === 0);

  constructor() {
    this.applied$
      .pipe(
        map((value) => value.trim()),
        filter((value) => value.length > 0),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.appliedCount.update((count) => count + 1);
      });
  }

  /**
   * Captures the raw input text and feeds the debounced stream.
   * @param value Raw input value.
   */
  updateInput(value: string): void {
    this.liveInput.set(value);
    this.input$.next(value);
  }

  /**
   * Emits the current value as an output event.
   */
  apply(): void {
    const value = this.liveInput().trim();
    if (!value) return;
    this.applyClicks$.next(value);
  }
}
