import {Pipe, PipeTransform} from '@angular/core';
import {format, formatDistanceToNow, isDate} from 'date-fns';

const defaultDateFormat = 'dd MMM y';
const defaultTimeFormat = 'HH:mm';

@Pipe({name: 'dsjtDate'})
export class DatePipe implements PipeTransform {
  transform(value: string | Date, customFormat?: string): string {
    return value ? format(isDate(value) ? value as Date : new Date(value), customFormat || defaultDateFormat) : '';
  }
}

@Pipe({name: 'dsjtDateTime'})
export class DatetimePipe implements PipeTransform {
  transform(value: string | Date): string {
    return value ? format(isDate(value) ? value as Date : new Date(value), defaultDateFormat + ' ' + defaultTimeFormat) : '';
  }
}

@Pipe({name: 'dsjtDateDistanceToNow'})
export class DateDistanceToNowPipe implements PipeTransform {
  transform(value: string | Date): string {
    return value ? formatDistanceToNow(isDate(value) ? value as Date : new Date(value), {addSuffix: true}) : '';
  }
}
