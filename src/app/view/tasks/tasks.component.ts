import {Component, OnInit} from '@angular/core';
import {DataHandlerService} from '../../services/data-handler.service';
import {Task} from '../../model/interfaces';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category'];
  /*container for table data from tasks[]*/
  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>();

  constructor(private data: DataHandlerService) {
  }

  ngOnInit(): void {
    this.data.taskSubject.subscribe(tasks => this.tasks = tasks);
    /*update data source if data of tasks updated*/
    this.refreshTable();
  }

  completedTask(task: Task): void {
    task.completed = !task.completed;
  }

  private refreshTable(): void {
    this.dataSource.data = this.tasks;
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
}
