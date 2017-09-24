import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

const dateFormat = 'DD MMM YYYY';
const timeFormat = 'HH:mm';

@Pipe({name: 'date'})
export class DatePipe implements PipeTransform {
  transform(value: string, customFormat?: string): string {
    return value ? moment(value).format(customFormat || dateFormat) : value;
  }
}

@Pipe({name: 'datetime'})
export class DatetimePipe implements PipeTransform {
  transform(value: string): string {
    return value ? moment(value).format(dateFormat + ' ' + timeFormat) : value;
  }
}
