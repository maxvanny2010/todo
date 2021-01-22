// все возможные параметры поиска категорий
export class CategorySearchValues {
  title: any = null;
}

export class PrioritySearchValues {
  title: any = null;
}

// все возможные параметры поиска категорий
export class TaskSearchValues {

  title = '';
  completed: any = null;
  priorityId: any = null;
  categoryId: any = null;
  pageNumber = 0; // 1-я страница (значение по-умолчанию)
  pageSize = 5; // сколько элементов на странице (значение по-умолчанию)

  // сортировка
  sortColumn = 'title';
  sortDirection = 'asc';
}
