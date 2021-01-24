import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {EditTaskDialogComponent} from '../../dialog/edit-task-dialog/edit-task-dialog.component';
import {MatDialog} from '@angular/material/dialog';

import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';
import {OperType} from '../../dialog/OperType';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Priority} from '../../model/Priority';
import {Task} from 'src/app/model/Task';
import {Category} from '../../model/Category';
import {TaskSearchValues} from '../../data/dao/search/SearchObjects';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  // to set values only in html in base page in <app-tasks [tasks]="tasks">
  tasks: Task[] = [];
  priorities: Priority[] = [];
  taskSearchValues!: TaskSearchValues;
  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category', 'operations', 'select'];
  /*container for table data from tasks[] ps. it can be db or any data source*/
  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>();
  @Output() addTask: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() deleteTask: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() updateTask: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() selectCategory: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() paging: EventEmitter<PageEvent> = new EventEmitter<PageEvent>(); // переход по страницам данных
  @Output() searchAction = new EventEmitter<TaskSearchValues>();
  @Output() filterByTitle: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterByStatus: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterByPriority: EventEmitter<Priority> = new EventEmitter<Priority>();

  // search
  searchTaskText = ''; // current text for search tasks
  selectedStatusFilter: any = null;   // by default to show task by all status
  selectPriorityFilter: any = null;
  @Input() totalTasksFounded!: number; // сколько всего задач найдено
  @Input() selectedCategory: Category | undefined;
  isMobile!: boolean;
  isTablet!: boolean;
  readonly colorCompletedTask = '#F8F9FA';
  readonly colorWhite = '#fff';
  @ViewChild(MatPaginator, {static: false}) private paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) private sort!: MatSort;

  constructor(
    private deviceService: DeviceDetectorService,
    private dialog: MatDialog,
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
  }

  // задачи для отображения на странице
  @Input('tasks')
  set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.assignTableSource();   // передать данные таблице для отображения задач
  }

  // все возможные параметры для поиска задач
  @Input('taskSearchValues')
  set setTaskSearchValues(taskSearchValues: TaskSearchValues) {
    this.taskSearchValues = taskSearchValues;
  }

  @Input('priorities')
  set setPriorities(priorities: Priority[]) {
    this.priorities = priorities;
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

  onSelectCategory(category: Category | undefined): void {
    this.selectCategory.emit(category);
  }

  onFilterByTitle(): void {
    this.filterByTitle.emit(this.searchTaskText);
  }

  onFilterByStatus(value: any): void {
    if (value !== this.selectedStatusFilter) {
      this.selectedStatusFilter = value;
      this.filterByStatus.emit(this.selectedStatusFilter);
    }
  }

  onFilterByPriority(value: any): void {
    if (value !== this.selectPriorityFilter) {
      this.selectPriorityFilter = value;
      this.filterByPriority.emit(this.selectPriorityFilter);
    }
  }

  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskDialogComponent,
      {data: [task, 'Редактирование задачи', OperType.EDIT], autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteTask.emit(task);
        return;
      } else if (result === 'active') {
        task.completed = false;
        this.updateTask.emit(task);
        return;
      } else if (result === 'complete') {
        task.completed = true;
        this.updateTask.emit(task);
        return;
      } else if (result as Task) {
        this.updateTask.emit(task);
        return;
      }
    });
  }

  openDeleteDialog(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы действительно хотите удалить задачу: ${task.title}?`
      }, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTask.emit(task);
      }
    });
  }

  openAddDialog(): void {
    const task: Task = {
      id: 0,
      title: '',
      completed: false,
      priority: undefined,
      category: this.selectedCategory
    };
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: [task, 'Добавление задачи', OperType.ADD]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addTask.emit(task);
      }
    });
  }

  pageChanged(pageEvent: PageEvent): void {
    this.paging.emit(pageEvent);
  }

  // в зависимости от статуса задачи - вернуть фоновый цвет
  getMobilePriorityBgColor(task: Task): string {
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
    task.completed = !task.completed;
  }

  private addTableObjects(): void {
    /*component for sort data*/
    this.dataSource.sort = this.sort;
    /*update component paginator(count pages or notes)*/
    this.dataSource.paginator = this.paginator;
  }
}
