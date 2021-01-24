import {Component, OnInit} from '@angular/core';
import {zip} from 'rxjs';
import {IntroService} from './services/intro.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatDrawerMode} from '@angular/material/sidenav/drawer';
import {DatepickerDropdownPositionX} from '@angular/material/datepicker';
import {CategoryService} from './data/dao/impl/category.service';
import {CategorySearchValues, TaskSearchValues} from './data/dao/search/SearchObjects';
import {Category} from './model/Category';
import {Priority} from './model/Priority';
import {Task} from './model/Task';
import {TaskService} from './data/dao/impl/task.service';
import {MatDialog} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  categories: Category[] = [];
  tasks: Task[] = [];
  selectedCategoryInApp!: Category | undefined;
  uncompletedCountForCategoryAll!: any;
  showStat = true;
  menuOpened = true;
  menuPosition!: DatepickerDropdownPositionX;
  backDrop = false;
  menuMode!: MatDrawerMode;
  isMobile!: boolean;
  isTablet!: boolean;
  categorySearchValues = new CategorySearchValues();
  taskSearchValues = new TaskSearchValues();
  totalTasksFounded!: number;
  readonly defaultPageSize = 5;
  readonly defaultPageNumber = 0;


  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService,
    private introService: IntroService,
    private deviceService: DeviceDetectorService,
    private dialog: MatDialog,
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.showStat = !this.isMobile;
  }

  ngOnInit(): void {
    /* this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);
     this.dataHandler.getAllPriorities().subscribe(categories => this.priorities = categories);
     this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);*/
    this.fillAllCategories();
    this.selectCategory(undefined);
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
    /* this.dataHandler.updateTask(task).subscribe(() => {
       this.fillCategories();
       this.updateTasksAndStat();
     });*/
  }

  onDeleteTask(task: Task): void {
    /*this.dataHandler.deleteTask(task.id)
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
    });*/
  }

  onAddTask(task: Task): void {
    /*this.dataHandler.addTask(task).pipe(
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
    });*/
  }

  fillAllCategories(): void {
    this.categoryService.findAll().subscribe(categories => this.categories = categories);
  }

  /*Category action*/
  selectCategory(category: Category | undefined): void {
    this.selectedCategoryInApp = category;
    this.taskSearchValues.categoryId = category ? category.id : null;
    this.searchTasks(this.taskSearchValues);
    if (this.isMobile) {
      this.menuOpened = false;
    }
  }

  updateCategory(category: Category): void {
    this.categoryService.update(category).subscribe(() => {
      this.searchCategory(this.categorySearchValues);
    });
  }

  deleteCategory(category: Category): void {
    if (category.id != null) {
      this.categoryService.delete(category.id).subscribe(() => {
        this.searchCategory(this.categorySearchValues);
      });
    }
  }

  addCategory(category: Category): void {
    this.categoryService.add(category).subscribe(result => {
        this.searchCategory(this.categorySearchValues);
      }
    );
  }

  searchCategory(categorySearchValues: CategorySearchValues): void {
    this.categoryService.findCategories(categorySearchValues).subscribe(result => {
      this.categories = result;
    });
  }

  onFilterTasksByStatus(status: boolean): void {
    /* this.statusFilter = status;*/
    this.updateTasks();
  }

  onFilterTasksByPriority(priority: Priority): void {
    /* this.priorityFilter = priority;*/
    this.updateTasks();

  }

  updateTasksAndStat(): void {
    this.updateTasks();
    this.updateStat();
  }

  toggleStat(showStat: boolean): void {
    this.showStat = showStat;
  }

  toggleMenu(): void {
    this.menuOpened = !this.menuOpened;
  }

  paging(pageEvent: PageEvent): void {
    // если изменили настройку "кол-во на странице" - заново делаем запрос и показываем с 1й страницы
    if (this.taskSearchValues.pageSize !== pageEvent.pageSize) {
      this.taskSearchValues.pageNumber = 0; // новые данные будем показывать с 1-й страницы (индекс 0)
    } else {
      // если просто перешли на другую страницу
      this.taskSearchValues.pageNumber = pageEvent.pageIndex;
    }
    this.taskSearchValues.pageSize = pageEvent.pageSize;
    this.taskSearchValues.pageNumber = pageEvent.pageIndex;
    this.searchTasks(this.taskSearchValues); // показываем новые данные
  }

  searchTasks(taskSearchValues: TaskSearchValues): void {
    this.taskSearchValues = taskSearchValues;
    this.taskService.findTasks(this.taskSearchValues)
      .subscribe(task => {
        this.totalTasksFounded = task.totalElements;
        this.tasks = task.content;
      });
  }

  private updateTasks(): void {
    /*this.dataHandler.searchTasks(
      this.selectedCategoryInApp as Category,
      this.searchTaskText,
      this.statusFilter,
      this.priorityFilter
    ).subscribe(tasks => {
      this.tasks = tasks;
    });*/
  }

  private updateCategories(): void {
    /* this.dataHandler.getAllCategories()
       .subscribe((categories) => {
         this.categories = categories;
         this.fillCategories();
       });*/
  }

  private updateStat(): void {
    zip(
      /* this.dataHandler.getTotalCountInCategory(this.selectedCategoryInApp),
       this.dataHandler.getCompletedCountInCategory(this.selectedCategoryInApp),
       this.dataHandler.getUnCompletedCountInCategory(this.selectedCategoryInApp),
       this.dataHandler.getUnCompletedTotalCount(),*/
    ).subscribe(array => {
      /*this.totalTasksCountInCategory = array[0];
      this.completedCountInCategory = array[1];
      this.uncompletedCountInCategory = array[2];
      this.uncompletedCountForCategoryAll = array[3];*/
    });
  }
}
