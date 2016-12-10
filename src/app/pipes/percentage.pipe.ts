import { Pipe, PipeTransform } from '@angular/core';

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
@Pipe({ name: 'percentage', pure: false, })
export class PercentagePipe implements PipeTransform {
    transform(value: number): string {        
        if (value <= 30) {
            return 'text-danger'
        }
        if (value <= 60) {
            return 'text-warning'
        }
        if (value <= 90) {
            return 'text-primary'
        }
        return 'text-success'
    }
}
