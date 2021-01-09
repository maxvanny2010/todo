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
  searchCategoryText = '';

  constructor(private dataHandler: DataHandlerService) {
  }

  ngOnInit(): void {
    this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);
    this.dataHandler.getAllPriorities().subscribe(categories => this.priorities = categories);
    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
    this.onSelectCategory(undefined);
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
    console.log(category.title);
    this.dataHandler.updateCategory(category)
      .subscribe(() => {
        this.onSearchCategory(category.title);
      });
  }

  onDeleteCategory(category: Category): void {
    console.log(category);
    this.dataHandler.deleteCategory(category)
      .subscribe(() => {
        this.selectedCategoryInApp = undefined;
        this.searchCategoryText = '';
        this.updateCategories();
        this.updateTasks();
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

  onSearchCategory(title: string): void {
    this.searchCategoryText = title;
    console.log(this.searchCategoryText);
    this.dataHandler.searchCategories(this.searchCategoryText)
      .subscribe(categories => this.categories = categories);

  }
}
