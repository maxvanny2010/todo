import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
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
import {DashboardData} from './action/DashboardData';
import {StatService} from './data/dao/impl/stat.service';
import {Stat} from './model/Stat';

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
  showStat = true;
  showSearch = true;
  stat: Stat = new Stat();
  dash: DashboardData = new DashboardData(0, 0);


  constructor(
    private categoryService: CategoryService,
    private priorityService: PriorityService,
    private taskService: TaskService,
    private statService: StatService,
    private introService: IntroService,
    private deviceService: DeviceDetectorService,
    private dialog: MatDialog
  ) {
    this.statService.getOverallStat().subscribe(result => {
      this.stat = result;
      this.uncompletedCountForCategoryAll = this.stat.uncompletedTotal;
      this.fillAllCategories().subscribe(res => {
        this.categories = res;
        this.selectCategory(this.selectedCategoryInApp); /*first to get stat*/

      });
    });
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

  fillDashData(completedCount: any, uncompletedCount: any): void {
    this.dash.completedTotal = completedCount;
    this.dash.uncompletedTotal = uncompletedCount;
  }

  fillAllPriorities(): void {
    this.priorityService.findAll().subscribe(result => {
      this.priorities = result;
    });
  }

  fillAllCategories(): Observable<Category[]> {
    return this.categoryService.findAll();
  }

  addTask(task: Task): void {
    this.taskService.add(task).subscribe(() => {
      if (task.category) {
        this.updateCategoryCounter(task.category);
      }
      this.updateOverallCounter();
      this.searchTasks(this.taskSearchValues);
    });
  }

  /*Task action*/
  updateTask(task: Task): void {
    this.taskService.update(task).subscribe(() => {
      if (task.oldCategory) { /*if task to have old category*/
        this.updateCategoryCounter(task.oldCategory); /*update this old category*/
      }
      if (task.category) {
        this.updateCategoryCounter(task.category);
      }
      this.updateOverallCounter();
      this.searchTasks(this.taskSearchValues);
    });

  }

  deleteTask(task: Task): void {
    this.taskService.delete(task.id).subscribe(() => {
      this.taskService.delete(task.id).subscribe(() => {
        if (task.category) { /*if task to have category*/
          this.updateCategoryCounter(task.category); /*update category counter*/
        }
        this.updateOverallCounter(); /*update stat for all*/
        this.searchTasks(this.taskSearchValues); /*update task list*/
      });
    });
  }

  searchTasks(searchTaskValues: TaskSearchValues): void {
    this.taskSearchValues = searchTaskValues;
    this.taskService.findTasks(this.taskSearchValues).subscribe(result => {
      // Если выбранная страница для отображения больше, чем всего страниц - заново поиск и показать 1ю страницу.
      // Если пользователь был на 2й странице списка и выполнил новый поиск и доступна только 1 страница,
      // то поиск заново и показать с 1й страницы (индекс 0)
      if (result.totalPages > 0 && this.taskSearchValues.pageNumber >= result.totalPages) {
        this.taskSearchValues.pageNumber = 0;
        this.searchTasks(this.taskSearchValues);
      }
      this.totalTasksFounded = result.totalElements;
      this.tasks = result.content;
    });
  }

  /*Category action*/
  selectCategory(category: Category | undefined): void {
    if (category) {
      this.fillDashData(category.completedCount, category.uncompletedCount);
    } else {
      this.fillDashData(this.stat.completedTotal, this.stat.uncompletedTotal); /*for category ALL*/
    }
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
      this.selectedCategoryInApp = undefined; /*choose category ALL*/
      this.searchCategory(this.categorySearchValues);
      this.selectCategory(this.selectedCategoryInApp);
    }
  }

  addCategory(category: Category): void {
    this.categoryService.add(category).subscribe(() => {
        this.searchCategory(this.categorySearchValues);
      }
    );
  }

  searchCategory(categorySearchValues: CategorySearchValues): void {
    this.categoryService.findCategories(categorySearchValues).subscribe(result => {
      this.categories = result;
    });
  }

  /*update and show stat if choose this category*/
  updateCategoryCounter(category: Category): void {
    if (category.id !== null) {
      this.categoryService.findById(category.id).subscribe(cat => {
        this.categories[this.getCategoryIndex(category)] = cat; /*change in local array*/
        this.showCategoryDashboard(cat);  /*show stat category*/
      });
    }
  }

  updateOverallCounter(): void {
    this.statService.getOverallStat().subscribe(res => {
      this.stat = res; /*get actual data from bd*/
      this.uncompletedCountForCategoryAll = this.stat.uncompletedTotal; /*for counter category ALL*/
      if (!this.selectedCategoryInApp) { // if choose ALL (selectedCategory === null)
        this.fillDashData(this.stat.completedTotal, this.stat.uncompletedTotal); /*fill dash*/
      }
    });
  }

  showCategoryDashboard(category: Category): void {
    if (this.selectedCategoryInApp && this.selectedCategoryInApp.id === category.id) { /*if choose category where we are now*/
      if (category.completedCount !== undefined && category.uncompletedCount !== undefined) {
        this.fillDashData(category.completedCount, category.uncompletedCount);
      }
    }
  }

  paging(pageEvent: PageEvent): void {
    if (this.taskSearchValues.pageSize !== pageEvent.pageSize) { /* if size task in page is change to show from 1 page( 0 index)*/
      this.taskSearchValues.pageNumber = 0;
    } else {
      this.taskSearchValues.pageNumber = pageEvent.pageIndex; /*if shift ot another page*/
    }
    this.taskSearchValues.pageSize = pageEvent.pageSize;
    this.taskSearchValues.pageNumber = pageEvent.pageIndex;
    this.searchTasks(this.taskSearchValues);
  }

  getCategoryFromArray(id: number): Category | undefined {
    return this.categories.find(t => t.id === id);
  }

  getCategoryIndex(category: Category): number {
    const tmpCategory = this.categories.find(t => t.id === category.id);
    if (tmpCategory) {
      return this.categories.indexOf(tmpCategory);
    }
    return -1;
  }

  getCategoryIndexById(id: number): number {
    const tmpCategory = this.categories.find(t => t.id === id);
    if (tmpCategory) {
      return this.categories.indexOf(tmpCategory);
    }
    return -1;
  }

  toggleStat(showStat: boolean): void {
    this.showStat = showStat;
  }

  toggleMenu(): void {
    this.menuOpened = !this.menuOpened;
  }

  toggleSearch(showSearch: boolean): void {
    this.showSearch = showSearch;
  }

  onClosedMenu(): void {
    this.menuOpened = false;
  }

  settingsChanged(): void {
    this.fillAllPriorities();
    this.searchTasks(this.taskSearchValues);
  }
}
