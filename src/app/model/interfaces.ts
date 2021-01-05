export interface Category {
  id: number;
  title: string;
}

export interface Priority {
  id: number;
  title: string;
  color: string;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority?: Priority;
  category?: Category;
  date?: Date;
}
