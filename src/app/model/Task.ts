import {Priority} from './Priority';
import {Category} from './Category';

export class Task {
  constructor(
    public id: number,
    public title: string,
    public completed: boolean,
    public priority?: Priority,
    public category?: Category,
    public  date?: Date) {
  }
}
