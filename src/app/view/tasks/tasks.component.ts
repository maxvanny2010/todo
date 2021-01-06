import {Component, OnInit} from '@angular/core';
import {DataHandlerService} from '../../services/data-handler.service';
import {Task} from '../../model/interfaces';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private data: DataHandlerService) {
  }

  ngOnInit(): void {
    this.data.taskSubject.subscribe(tasks => this.tasks = tasks);
  }

  completedTask(task: Task): void {
    task.completed = !task.completed;
  }
}
