import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'rankMethod'})
export class RankMethodPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'cup_points':
        return 'Cup Points';
      case 'jump_points':
        return 'Jump Points';
      default:
        return value;
    }
  }
}
