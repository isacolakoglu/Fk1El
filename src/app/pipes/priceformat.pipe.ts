import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceformat',
  standalone: true,
})
export class PriceformatPipe implements PipeTransform {
  transform(value: number): string {
    const formattedPrice = value.toFixed(2);
    return formattedPrice + '$';
  }
}
