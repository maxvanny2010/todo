import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {EditTaskDialogComponent} from '../../dialog/edit-task-dialog/edit-task-dialog.component';
import {MatDialog} from '@angular/material/dialog';

import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Priority} from '../../model/Priority';
import {Task} from 'src/app/model/Task';
import {Category} from '../../model/Category';
import {TaskSearchValues} from '../../data/dao/search/SearchObjects';
import {DialogAction} from '../../action/DialogResult';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  // to set values only in html in base page in <app-tasks [tasks]="tasks">
  tasks: Task[] = [];
  priorities: Priority[] = [];
  categories: Category[] = [];
  taskSearchValues!: TaskSearchValues;
  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category', 'operations', 'select'];
  /*container for table data from tasks[] ps. it can be db or any data source*/
  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>();
  @Output() addTask: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() deleteTask: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() updateTask: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() selectCategory: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() paging: EventEmitter<PageEvent> = new EventEmitter<PageEvent>(); /*shift between pages*/
  @Output() searchAction = new EventEmitter<TaskSearchValues>();
  @Output() toggleSearch = new EventEmitter<boolean>(); /*show|hide search*/
  @Output() filterByTitle: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterByStatus: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterByPriority: EventEmitter<Priority> = new EventEmitter<Priority>();

  // search
  filterTitle!: string;
  filterCompleted!: number | null;
  filterPriorityId!: number | null;
  filterSortColumn!: string;
  filterSortDirection!: string;
  sortIconName!: string; /*icon for sort asc|desc*/
  readonly iconNameDown = 'arrow_downward';
  readonly iconNameUp = 'arrow_upward';
  readonly colorCompletedTask = '#F8F9FA';
  readonly colorWhite = '#fff';
  readonly defaultSortColumn = 'title';
  readonly defaultSortDirection = 'asc';
  @Input() totalTasksFounded!: number; /*how many task found*/
  @Input() selectedCategory: Category | undefined;
  @Input() showSearch!: boolean;
  isMobile!: boolean;
  isTablet!: boolean;
  changed = false;
  @ViewChild(MatPaginator, {static: false}) private paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) private sort!: MatSort;

  constructor(
    private deviceService: DeviceDetectorService,
    private dialog: MatDialog,
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
  }

  @Input('tasks') /* task for to show in page*/
  set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.assignTableSource();  /*data for datasource*/
  }

  @Input('taskSearchValues') /*parameters for search*/
  set setTaskSearchValues(taskSearchValues: TaskSearchValues) {
    this.taskSearchValues = taskSearchValues;
    this.initSearchValues();
    this.initSortDirectionIcon();
  }

  @Input('priorities')
  set setPriorities(priorities: Priority[]) {
    this.priorities = priorities;
  }

  @Input('categories')
  set setCategories(categories: Category[]) {
    this.categories = categories;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Task>();
    this.onSelectCategory(undefined);
    /*to fill a table with data*/
  }

  assignTableSource(): void {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.data = this.tasks;

  }

  getPriorityColor(task: Task): string {
    // task completed return color default
    if (task.completed) {
      return this.colorCompletedTask;
    }
    // if is color priority than return
    if (task.priority && task.priority.color) {
      return task.priority.color;
    }
    return this.colorWhite;
  }

  initSearch(): void {
    // to save before search
    this.taskSearchValues.title = this.filterTitle;
    this.taskSearchValues.completed = this.filterCompleted;
    this.taskSearchValues.priorityId = this.filterPriorityId;
    this.taskSearchValues.sortColumn = this.filterSortColumn;
    this.taskSearchValues.sortDirection = this.filterSortDirection;

    this.searchAction.emit(this.taskSearchValues);
    this.changed = false; // reset flag changed for input
  }

  checkFilterChanged(): boolean {
    this.changed = false;
    // check all filter
    if (this.taskSearchValues.title !== this.filterTitle) {
      this.changed = true;
    }

    if (this.taskSearchValues.completed !== this.filterCompleted) {
      this.changed = true;
    }

    if (this.taskSearchValues.priorityId !== this.filterPriorityId) {
      this.changed = true;
    }

    if (this.taskSearchValues.sortColumn !== this.filterSortColumn) {
      this.changed = true;
    }

    if (this.taskSearchValues.sortDirection !== this.filterSortDirection) {
      this.changed = true;
    }
    return this.changed;
  }

  initSortDirectionIcon(): void {  /*choose icon*/
    if (this.filterSortDirection === 'desc') {
      this.sortIconName = this.iconNameDown;
    } else {
      this.sortIconName = this.iconNameUp;
    }
  }

  changedSortDirection(): void {  /*change direction of sort*/
    if (this.filterSortDirection === 'asc') {
      this.filterSortDirection = 'desc';
    } else {
      this.filterSortDirection = 'asc';
    }
    this.initSortDirectionIcon(); /*set icon*/
  }

// проинициализировать локальные переменные поиска
  initSearchValues(): void {
    if (!this.taskSearchValues) {
      return;
    }
    this.filterTitle = this.taskSearchValues.title;
    this.filterCompleted = this.taskSearchValues.completed;
    this.filterPriorityId = this.taskSearchValues.priorityId;
    this.filterSortColumn = this.taskSearchValues.sortColumn;
    this.filterSortDirection = this.taskSearchValues.sortDirection;
  }

  clearSearchValues(): void {/*reset local variable for search*/
    this.filterTitle = '';
    this.filterCompleted = null;
    this.filterPriorityId = null;
    this.filterSortColumn = this.defaultSortColumn;
    this.filterSortDirection = this.defaultSortDirection;
  }

  onToggleSearch(): void {/*show|hide block search*/
    this.toggleSearch.emit(!this.showSearch);
  }

  onSelectCategory(category: Category | undefined): void {
    this.selectCategory.emit(category);
  }

  openAddDialog(): void {
    const task = new Task(0, '', 0, undefined, this.selectedCategory);
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      /*empty task*/
      data: [task, 'Добавление задачи', this.categories, this.priorities]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) {
        return;
      }
      if (result.action === DialogAction.SAVE) {
        this.addTask.emit(task);
      }
    });

  }

  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: [task, 'Редактирование задачи', this.categories, this.priorities],
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) {
        return;
      }
      if (result.action === DialogAction.DELETE) {
        this.deleteTask.emit(task);
        return;
      }
      if (result.action === DialogAction.COMPLETE) {
        task.completed = 1;
        this.updateTask.emit(task);
      }
      if (result.action === DialogAction.ACTIVATE) {
        task.completed = 0;
        this.updateTask.emit(task);
        return;
      }
      if (result.action === DialogAction.SAVE) {
        this.updateTask.emit(task);
        return;
      }
    });
  }

  openDeleteDialog(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {dialogTitle: 'Подтвердите действие', message: `Вы действительно хотите удалить задачу: "${task.title}"?`},
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) {
        return;
      }
      if (result.action === DialogAction.OK) {
        this.deleteTask.emit(task);
      }
    });
  }

  pageChanged(pageEvent: PageEvent): void {
    this.paging.emit(pageEvent);
  }

  getMobilePriorityBgColor(task: Task): string {/*return background color of priority*/
    if (task.priority != null && !task.completed) {
      return task.priority.color;
    }
    return 'none';
  }

  getPriorityBgColor(task: Task): string {
    if (task.priority != null && !task.completed) {
      return task.priority.color;
    }
    return 'none';
  }

  onToggleCompleted(task: Task): void {
    task.completed = task.completed === 0 ? 1 : 0;
    this.updateTask.emit(task);
  }
}
