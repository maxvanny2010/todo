import {Component, OnInit} from '@angular/core';
import {Observable, zip} from 'rxjs';
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
import {PriorityService} from './data/dao/impl/priority.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  categories: Category[] = [];
  priorities: Priority[] = [];
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
  showSearch!: boolean;


  constructor(
    private categoryService: CategoryService,
    private priorityService: PriorityService,
    private taskService: TaskService,
    private introService: IntroService,
    private deviceService: DeviceDetectorService,
    private dialog: MatDialog,
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.showStat = !this.isMobile;
    this.setMenuDisplayParams();
  }

  ngOnInit(): void {
    if (!this.isMobile && !this.isTablet) {
      this.introService.startIntroJS(true);
    }
    this.fillAllCategories().subscribe(result => {
      this.categories = result;
      this.selectCategory(this.selectedCategoryInApp);
    });
    this.fillAllPriorities();
  }

  setMenuDisplayParams(): void {
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

  fillAllPriorities(): void {
    this.priorityService.findAll().subscribe(result => {
      this.priorities = result;
    });
  }

  updateTask(task: Task): void {
    this.taskService.update(task).subscribe(() => {
      this.searchTasks(this.taskSearchValues);
    });
  }

  deleteTask(task: Task): void {
    this.taskService.delete(task.id).subscribe(() => {
      this.searchTasks(this.taskSearchValues);
    });
  }

  addTask(task: Task): void {
    this.taskService.add(task).subscribe(() => {
      this.searchTasks(this.taskSearchValues);
    });
  }

  fillAllCategories(): Observable<Category[]> {
    return this.categoryService.findAll();
  }

  /*Category action*/
  selectCategory(category: Category | undefined): void {
    this.taskSearchValues.pageNumber = 0; /*reset for to show from 0 page*/
    this.selectedCategoryInApp = category; /* remember select category */
    this.taskSearchValues.categoryId = category ? category.id : null; /* for search task by category*/
    this.searchTasks(this.taskSearchValues); /*update list of task by category and parameters from taskSearchValues*/
    if (this.isMobile) {
      this.menuOpened = false;
    }
  }

  updateCategory(category: Category): void {
    this.categoryService.update(category).subscribe(() => {
      this.searchCategory(this.categorySearchValues); /*update list of category*/
      this.searchTasks(this.taskSearchValues); /*update list of task*/
    });
  }

  deleteCategory(category: Category): void {
    if (category.id != null) {
      this.categoryService.delete(category.id).subscribe(cat => {
        this.selectedCategoryInApp = undefined; /* select category ALL*/
        this.searchCategory(this.categorySearchValues);
        this.selectCategory(this.selectedCategoryInApp);
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

  toggleStat(showStat: boolean): void {
    this.showStat = showStat;
  }

  toggleMenu(): void {
    this.menuOpened = !this.menuOpened;
  }

  onClosedMenu(): void {
    this.menuOpened = false;
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

  searchTasks(searchTaskValues: TaskSearchValues): void {
    this.taskSearchValues = searchTaskValues;
    this.taskService.findTasks(this.taskSearchValues).subscribe(result => {
      // Если выбранная страница для отображения больше, чем всего страниц - заново делаем поиск и показываем 1ю страницу.
      // Если пользователь был например на 2й странице общего списка и выполнил новый поиск,
      // в результате которого доступна только 1 страница,
      // то нужно вызвать поиск заново с показом 1й страницы (индекс 0)
      if (result.totalPages > 0 && this.taskSearchValues.pageNumber >= result.totalPages) {
        this.taskSearchValues.pageNumber = 0;
        this.searchTasks(this.taskSearchValues);
      }
      this.totalTasksFounded = result.totalElements;
      this.tasks = result.content;
    });
  }

  toggleSearch(showSearch: boolean): void {
    this.showSearch = showSearch;
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
