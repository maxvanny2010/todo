import {Priority} from './Priority';
import {Category} from './Category';

export class Task {
  constructor(
    public id: number,
    public title: string,
    public completed: number,
    public priority?: Priority,
    public category?: Category,
    public  date?: Date,
    public oldCategory?: Category) {
  }
}
