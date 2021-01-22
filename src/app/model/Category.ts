export class Category {
  constructor(public id: number,
              public  title: string,
              public  completedCount?: number,
              public  uncompletedCount?: number) {
  }
}
