export class Category {
  constructor(public id: number | null,
              public  title: string,
              public  completedCount?: any,
              public  uncompletedCount?: any) {
  }
}
