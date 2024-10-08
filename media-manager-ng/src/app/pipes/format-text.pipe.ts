import { Pipe, PipeTransform } from '@angular/core';

export type TextFormat = 'title-case' | 'upper-first' | 'lower-first';

@Pipe({
  name: 'formatText',
  standalone: true,
})
export class FormatTextPipe implements PipeTransform {
  transform(value: string, format: TextFormat = 'title-case'): string {
    // console.warn(`-------- FormatTextPipe called with params ${value}, ${format}`);
    switch (format) {
      case 'title-case':
        return value.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
      case 'upper-first':
        return value.charAt(0).toUpperCase() + value.slice(1);
      case 'lower-first':
        return value.charAt(0).toLowerCase() + value.slice(1);
      // Ya no hace falta definir un "default" porque ya hemos cubierto todos los posibles casos de "format"
      // default:
      //   return value;
    }
  }
}
