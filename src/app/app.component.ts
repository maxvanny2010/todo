import {Component, OnInit} from '@angular/core';
import {Category, Priority, Task} from './model/interfaces';
import {DataHandlerService} from './services/data-handler.service';
import {zip} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';
import {IntroService} from './services/intro.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatDrawerMode} from '@angular/material/sidenav/drawer';
import {DatepickerDropdownPositionX} from '@angular/material/datepicker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  categoryMap = new Map<Category, number>();
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
  menuOpened = true;
  menuPosition!: DatepickerDropdownPositionX;
  backDrop = false;
  menuMode!: MatDrawerMode;
  isMobile!: boolean;
  isTablet!: boolean;

  constructor(
    private dataHandler: DataHandlerService,
    private introService: IntroService,
    private deviceService: DeviceDetectorService,
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.showStat = !this.isMobile;
  }

  ngOnInit(): void {
    this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);
    this.dataHandler.getAllPriorities().subscribe(categories => this.priorities = categories);
    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
    this.fillCategories();
    this.onSelectCategory(undefined);
    if (!this.isMobile && !this.isTablet) {
      this.introService.startIntroJS(true);
    }
    this.setMenuValues();
  }

  setMenuValues(): void {
    this.menuPosition = 'start';
    if (this.isMobile) {
      this.menuOpened = false;
      this.menuMode = 'over';
      this.backDrop = true;
    } else {
      this.menuOpened = true;
      this.menuMode = 'push';
      this.backDrop = false;
    }
  }

  onUpdateTask(task: Task): void {
    this.dataHandler.updateTask(task).subscribe(() => {
      this.fillCategories();
      this.updateTasksAndStat();
    });
  }

  onDeleteTask(task: Task): void {
    this.dataHandler.deleteTask(task.id)
      .pipe(
        concatMap((tsk) => {
            // @ts-ignore
            return this.dataHandler.getUnCompletedCountInCategory(tsk.category)
              .pipe(
                map(count => {
                  return ({t: tsk, count});
                }));
          }
        )).subscribe(result => {
      const t = result.t as Task;
      this.categoryMap.set(t.category as Category, result.count);
      this.updateTasksAndStat();
    });
  }

  onAddTask(task: Task): void {
    this.dataHandler.addTask(task).pipe(
      concatMap((tsk) => {
          return this.dataHandler.getUnCompletedCountInCategory(tsk.category)
            .pipe(
              map(count => {
                return ({t: tsk, count});
              }));
        }
      )).subscribe(result => {
      const t = result.t as Task;
      if (t.category) {
        this.categoryMap.set(t.category as Category, result.count);
      }
      this.updateTasksAndStat();
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

  fillCategories(): void {
    if (this.categoryMap) {
      this.categoryMap.clear();
    }
    this.categories = this.categories.sort((a, b) => a.title.localeCompare(b.title));
    this.categories.forEach((cat: Category) =>
      this.dataHandler.getUnCompletedCountInCategory(cat).subscribe(count => this.categoryMap.set(cat, count))
    );
  }

  onSelectCategory(category: Category | undefined): void {
    this.selectedCategoryInApp = category;
    this.updateTasksAndStat();
  }

  onUpdateCategory(category: Category): void {
    this.dataHandler.updateCategory(category)
      .subscribe(() => {
        this.fillCategories();
      });
  }

  onDeleteCategory(category: Category): void {
    this.dataHandler.deleteCategory(category)
      .subscribe((cat) => {
        this.selectedCategoryInApp = undefined;
        /* this.searchCategoryText = '';*/
        this.categoryMap.delete(cat);
        /* this.fillCategories();*/
        this.updateTasksAndStat();
      });
  }

  onAddCategory(title: string): void {
    this.dataHandler.addCategory(title).subscribe(() => {
      this.updateCategories();
    });
  }

  private updateCategories(): void {
    this.dataHandler.getAllCategories()
      .subscribe((categories) => {
        this.categories = categories;
        this.fillCategories();
      });
  }

  onSearchCategory(title: string): void {
    this.searchCategoryText = title;
    this.dataHandler.searchCategories(title).subscribe(categories => {
      this.categories = categories;
      this.fillCategories();
      if (title === '') {
        this.selectedCategoryInApp = undefined;
        this.searchCategoryText = '';
        this.updateTasksAndStat();
      }
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

  toggleMenu(): void {
    this.menuOpened = !this.menuOpened;
  }
}
