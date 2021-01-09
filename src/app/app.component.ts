import {Component, OnInit} from '@angular/core';
import {Category, Priority, Task} from './model/interfaces';
import {DataHandlerService} from './services/data-handler.service';
import {zip} from 'rxjs';

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
  totalTasksCountInCategory: any | undefined;
  completedCountInCategory: any | undefined;
  uncompletedCountInCategory: any | undefined;
  uncompletedTotalTasksCount: any | undefined;
  showStat = true;

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
    this.updateTasksAndStat();
  }

  onUpdateTask(task: Task): void {
    this.dataHandler.updateTask(task).subscribe(() => {
      this.updateTasksAndStat();
    });
  }

  onDeleteTask(task: Task): void {
    this.dataHandler.deleteTask(task.id).subscribe(() => {
      this.updateTasksAndStat();
    });
  }

  onUpdateCategory(category: Category): void {
    this.dataHandler.updateCategory(category)
      .subscribe(() => {
        this.onSearchCategory(category.title);
      });
  }

  onDeleteCategory(category: Category): void {
    this.dataHandler.deleteCategory(category)
      .subscribe(() => {
        this.selectedCategoryInApp = undefined;
        this.searchCategoryText = '';
        this.updateCategories();
        this.updateTasksAndStat();
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
    this.dataHandler.addTask(task).subscribe(() => this.updateTasksAndStat());
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
    this.dataHandler.searchCategories(this.searchCategoryText)
      .subscribe(categories => this.categories = categories);

  }

  updateTasksAndStat(): void {
    this.updateTasks();
    this.updateStat();
  }

  private updateStat(): void {
    zip(
      this.dataHandler.getTotalCountInCategory(this.selectedCategoryInApp),
      this.dataHandler.getCompletedCountInCategory(this.selectedCategoryInApp),
      this.dataHandler.getUnCompletedCountInCategory(this.selectedCategoryInApp),
      this.dataHandler.getUnCompletedTotalCount(),
    ).subscribe(array => {
      this.totalTasksCountInCategory = array[0];
      this.completedCountInCategory = array[1];
      this.uncompletedCountInCategory = array[2];
      this.uncompletedTotalTasksCount = array[3];
    });
  }

  toggleStat(showStat: boolean): void {
    this.showStat = showStat;
  }
}
