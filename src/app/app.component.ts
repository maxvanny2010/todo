import {Component, OnInit} from '@angular/core';
import {Category, Priority, Task} from './model/interfaces';
import {DataHandlerService} from './services/data-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'todo';
  tasks: Task[] = [];
  categories: Category[] = [];
  priorities: Priority[] = [];
  selectedCategoryInApp: Category | undefined;
  private searchTaskText = '';
  private statusFilter!: boolean;
  private priorityFilter!: Priority;

  constructor(private dataHandler: DataHandlerService) {
  }

  ngOnInit(): void {
    this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);
    this.dataHandler.getAllPriorities().subscribe(categories => this.priorities = categories);
    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
  }

  onSelectCategory(category: Category | undefined): void {
    this.selectedCategoryInApp = category;
    this.updateTasks();
  }

  onUpdateTask(task: Task): void {
    this.dataHandler.updateTask(task).subscribe(() => {
      this.updateTasks();
    });
  }

  onDeleteTask(task: Task): void {
    this.dataHandler.deleteTask(task.id).subscribe(() => {
      this.updateTasks();
    });
  }

  onUpdateCategory(category: Category): void {
    this.dataHandler.updateCategory(category)
      .subscribe(() => {
        this.onSelectCategory(this.selectedCategoryInApp);
      });
  }

  onDeleteCategory(category: Category): void {
    this.dataHandler.deleteCategory(category)
      .subscribe(() => {
        this.selectedCategoryInApp = undefined;
        this.onSelectCategory(this.selectedCategoryInApp);
      });
  }

  onSearchTasks(searchString: string): void {
    this.searchTaskText = searchString;
    this.updateTasks();
  }

  onFilterTasksByStatus(status: boolean): void {
    this.statusFilter = status;
    this.updateTasks();
  }

  onFilterTasksByPriority(priority: Priority): void {
    this.priorityFilter = priority;
    this.updateTasks();

  }

  onAddTask(task: Task): void {
    this.dataHandler.addTask(task).subscribe(() => this.updateTasks());
  }

  onAddCategory(title: string): void {
    this.dataHandler.addCategory(title).subscribe(() => {
      this.updateCategories();
    });
  }

  private updateTasks(): void {
    this.dataHandler.searchTasks(
      this.selectedCategoryInApp as Category,
      this.searchTaskText,
      this.statusFilter,
      this.priorityFilter
    ).subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  private updateCategories(): void {
    this.dataHandler.getAllCategories()
      .subscribe((categories) => this.categories = categories);
  }
}
