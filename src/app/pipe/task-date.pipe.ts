import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'taskDate'
})
export class TaskDatePipe implements PipeTransform {

  transform(date: Date | string, format: string = 'mediumDate'): string {

    if (date == null) {
      return 'Без срока';
    }
    date = new Date(date);
    const requiredDate = date.getDate();
    const currentDate = new Date().getDate();
    if (requiredDate === currentDate) {
      return 'Сегодня';
    } else if (requiredDate === currentDate - 1) {
      return 'Вчера';
    } else if (requiredDate === currentDate + 1) {
      return 'Завтра';
    }
    return new DatePipe('ru-RU').transform(date, format) as string;
  }

}
