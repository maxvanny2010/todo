export class Category {
  constructor(public id: number | null,
              public  title: string,
              public  completedCount?: number,
              public  uncompletedCount?: number) {
  }
}
