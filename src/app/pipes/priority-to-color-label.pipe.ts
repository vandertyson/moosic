import {Pipe, PipeTransform} from '@angular/core';

/*
 * A Mapping from Role ID to Color Label
 * +---+---------------+
 * | 1 | success       |
 * +---+---------------+
 * | 2 | warning       |
 * +---+---------------+
 * | 3 | primary       |
 * +---+---------------+
 *
 * Usage:
 *  value | roleToColorLabel
 * Example:
 *  {{ 1 | roleToColorLabel }}
 *  formats to: success
 */
@Pipe({ name: 'priorityToColorLabel' })
export class PriorityToColorLabel implements PipeTransform {
  transform(value: string): string {
    let mapping = {
      '10': 'success',
      '5': 'danger',
      '25': 'warning',
      '20': 'primary'
    };
    return mapping[value];
  }
}
