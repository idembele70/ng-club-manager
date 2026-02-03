import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millions',
})
export class MillionsPipe implements PipeTransform {

  transform(value: number | undefined): string {
    if (!value) return '';
    
    const millions = value / 1_000_000;
    return `${millions.toFixed(1).replace(/.0$/, '')}M`
  }

}
