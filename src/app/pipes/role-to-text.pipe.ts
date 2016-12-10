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
@Pipe({name: 'roleToText'})
export class RoleToTextPipe implements PipeTransform {
    transform(value:number):string {
        let mapping = {
            0: 'System Administrator',
            1: 'Administrator',
            2: 'Role 2',
            3: 'Role 3'
        };

        return mapping[value];
    }
}