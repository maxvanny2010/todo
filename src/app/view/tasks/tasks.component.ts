import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Category, Priority, Task} from '../../model/interfaces';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {EditTaskDialogComponent} from '../../dialog/edit-task-dialog/edit-task-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {DataHandlerService} from '../../services/data-handler.service';

import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';
import {OperType} from '../../dialog/OperType';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  // to set values only in html in base page in <app-tasks [tasks]="tasks">
  tasks: Task[] = [];
  priorities: Priority[] = [];
  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category', 'operations', 'select'];
  /*container for table data from tasks[] ps. it can be db or any data source*/
  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>();

  @ViewChild(MatPaginator, {static: false}) private paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) private sort!: MatSort;

  @Output() updateTask: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() deleteTask: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() addTask: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() selectCategory: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() filterByTitle: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterByStatus: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterByPriority: EventEmitter<Priority> = new EventEmitter<Priority>();
  // поиск
  searchTaskText = ''; // текущее значение для поиска задач
  selectedStatusFilter: any = null;   // по-умолчанию будут показываться задачи по всем статусам (решенные и нерешенные)
  selectPriorityFilter: any = null;
  @Input() selectedCategory: Category | undefined;

  @Input('tasks')
  set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.fillTable();
  }

  @Input('priorities')
  set setPriorities(priorities: Priority[]) {
    this.priorities = priorities;
  }

  constructor(
    private dataHandler: DataHandlerService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    /*to fill a table with data*/
    this.fillTable();
  }

  getPriorityColor(task: Task): string {
    let color = '#fff';
    if (task.completed) {
      color = '#F8F9FA';
    } else if (task.priority && task.priority.color) {
      color = task.priority.color;
    }
    return color;
  }

  private fillTable(): void {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.data = this.tasks;
    this.addTableObjects();
    // @ts-ignore
    this.dataSource.sortingDataAccessor = (task, colName) => {
      // по каким полям выполнять сортировку для каждого столбца
      switch (colName) {
        case 'priority': {
          return task.priority ? task.priority.id : null;
        }
        case 'category': {
          return task.category ? task.category.title : null;
        }
        case 'date': {
          return task.date ? task.date : null;
        }

        case 'title': {
          return task.title;
        }
      }
    };
  }

  private addTableObjects(): void {
    /*component for sort data*/
    this.dataSource.sort = this.sort;
    /*update component paginator(count pages or notes)*/
    this.dataSource.paginator = this.paginator;
  }

  onToggleStatus(task: Task): void {
    task.completed = !task.completed;
    this.updateTask.emit(task);
  }

  onSelectCategory(category: Category): void {
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

  openEditTaskDialog(task: Task): void {
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

  openAddTaskDialog(): void {
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
}
