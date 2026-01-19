import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LabReference } from '../labs.models';

@Component({
  selector: 'app-lab-references',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lab-references.html',
  styleUrl: './lab-references.css'
})
/**
 * Reference link list for each lab.
 */
export class LabReferencesComponent {
  /** Optional anchor id to link from the table of contents. */
  readonly sectionId = input<string>('');
  readonly references = input.required<LabReference[]>();
}
