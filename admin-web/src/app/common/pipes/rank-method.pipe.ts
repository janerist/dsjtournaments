import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'dsjtRankMethod'})
export class RankMethodPipe implements PipeTransform {
  transform(value: string, args: any): string {
    switch (value) {
      case 'cup_points':
        return 'Cup points';

      case 'jump_points':
        return 'Jump points';

      default:
        return '';
    }
  }
}
