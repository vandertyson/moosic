import {Pipe, PipeTransform} from '@angular/core';

/*
 * A Mapping from Role ID to Text Role
 * +---+---------------+
 * | 1 | administrator |
 * +---+---------------+
 * | 2 | editor        |
 * +---+---------------+
 * | 3 | registered    |
 * +---+---------------+
 *
 * Usage:
 *  value | roleToText
 * Example:
 *  {{ 1 | roleToText }}
 *  formats to: Administrator
 */
@Pipe({name: 'priorityNumberToText'})
export class PriorityNumberToText implements PipeTransform {
    transform(value:string):string {
        let mapping = {
            '5': 'High',
            '10': 'Low',
            '25': 'Average',
            '20': 'Immediately'
        };
        return mapping[value];
    }
}