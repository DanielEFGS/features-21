import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LabSection } from '../labs.models';

@Component({
  selector: 'app-lab-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lab-section.html',
  styleUrl: './lab-section.css'
})
/**
 * Renders a single lab section with optional lists and code blocks.
 */
export class LabSectionComponent {
  readonly section = input.required<LabSection>();
}
