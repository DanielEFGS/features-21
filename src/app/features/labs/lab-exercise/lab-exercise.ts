import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LabExercise } from '../labs.models';

@Component({
  selector: 'app-lab-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lab-exercise.html',
  styleUrl: './lab-exercise.css'
})
/**
 * Exercise block with tasks, success criteria, and stretch goals.
 */
export class LabExerciseComponent {
  /** Optional anchor id to link from the table of contents. */
  readonly sectionId = input<string>('');
  readonly exercise = input.required<LabExercise>();
}
