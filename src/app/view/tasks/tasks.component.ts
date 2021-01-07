import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Task} from '../../model/interfaces';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {EditTaskDialogComponent} from '../../dialog/edit-task-dialog/edit-task-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {DataHandlerService} from '../../services/data-handler.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  // to set values only in html in base page in <app-tasks [tasks]="tasks">
  tasks: Task[] = [];
  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category'];
  /*container for table data from tasks[] ps. it can be db or any data source*/
  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>();

  @ViewChild(MatPaginator, {static: false}) private paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) private sort!: MatSort;

  @Output() updateTask: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() deleteTask: EventEmitter<Task> = new EventEmitter<Task>();

  @Input('tasks')
  set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.fillTable();
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

  openEditTaskDialog(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskDialogComponent,
      {data: [task, 'Редактирование задачи'], autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteTask.emit(task);
        return;
      } else if (result as Task) {
        this.updateTask.emit(task);
        return;
      }
    });
  }
}
