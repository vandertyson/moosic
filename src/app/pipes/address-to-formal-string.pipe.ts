import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addressToString',
  pure: false,
})

export class AddressToString implements PipeTransform {
  transform(value): string {
    var country = value.country ? " " + value.country : "";
    var state = value.state_province ? " " + value.state_province : "";
    var district = value.district ? " " + value.district : "";
    var street = value.street ? value.street : "";
    return (street + district + state + country).trim();
  }
}
