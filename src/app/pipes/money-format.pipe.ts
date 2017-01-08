import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'money',
  pure: false,
})
export class NumberToMoney implements PipeTransform {
  transform(value): string {    
    return (+value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }
}
