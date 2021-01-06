import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataHandlerService} from '../../services/data-handler.service';
import {Task} from '../../model/interfaces';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, AfterViewInit {
  tasks: Task[] = [];
  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category'];
  /*container for table data from tasks[] ps. it can be db or any data source*/
  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>();
  @ViewChild(MatPaginator, {static: false}) private paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) private sort!: MatSort;

  constructor(private data: DataHandlerService) {
  }

  ngOnInit(): void {
    this.data.getAllTasks().subscribe(tasks => this.tasks = tasks);
    /*update data source if data of tasks updated*/
    this.refreshTable();
  }

  ngAfterViewInit(): void {
    /*init after pain page*/
    this.addTableObjects();
  }

  completedTask(task: Task): void {
    task.completed = !task.completed;
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

  private refreshTable(): void {
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
}
