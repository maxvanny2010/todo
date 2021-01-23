import {Component, OnInit} from '@angular/core';
import {Category, Priority, Task} from './model/interfaces';
import {zip} from 'rxjs';
import {IntroService} from './services/intro.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatDrawerMode} from '@angular/material/sidenav/drawer';
import {DatepickerDropdownPositionX} from '@angular/material/datepicker';
import {CategoryService} from './data/dao/impl/category.service';
import {CategorySearchValues} from './data/dao/search/SearchObjects';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  categories: Category[] = [];
  selectedCategoryInApp: Category | undefined;
  uncompletedCountForCategoryAll!: any;
  showStat = true;
  menuOpened = true;
  menuPosition!: DatepickerDropdownPositionX;
  backDrop = false;
  menuMode!: MatDrawerMode;
  isMobile!: boolean;
  isTablet!: boolean;
  categorySearchValues = new CategorySearchValues();

  constructor(
    private service: CategoryService,
    private introService: IntroService,
    private deviceService: DeviceDetectorService,
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
    this.service.findAll().subscribe(categories => this.categories = categories);
    /* this.categories = this.categories.sort((a, b) => a.title.localeCompare(b.title));*/
    /*this.categories.forEach((cat: Category) =>
      this.dataHandler.getUnCompletedCountInCategory(cat).subscribe(count => this.categoryMap.set(cat, count))
    );*/
  }

  selectCategory(category: Category | undefined): void {
    this.selectedCategoryInApp = category;
    this.updateTasksAndStat();
  }

  updateCategory(category: Category): void {
    /*this.dataHandler.updateCategory(category)
      .subscribe(() => {
        this.fillCategories();
      });*/
  }

  deleteCategory(category: Category): void {
    /*this.dataHandler.deleteCategory(category)
      .subscribe((cat) => {
        this.selectedCategoryInApp = undefined;
        /!* this.searchCategoryText = '';*!/
        this.categoryMap.delete(cat);
        /!* this.fillCategories();*!/
        this.updateTasksAndStat();
      });*/
  }

  addCategory(category: Category): void {
    this.service.add(category).subscribe(result => {

      }
    );
  }

  searchCategory(categorySearchValues: CategorySearchValues): void {
    this.service.findCategories(categorySearchValues).subscribe(result => {
      this.categories = result;
    });
    /* this.searchCategoryText = title;*/
    /* this.dataHandler.searchCategories(title).subscribe(categories => {
       this.categories = categories;
       this.fillCategories();
       if (title === '') {
         this.selectedCategoryInApp = undefined;
         this.searchCategoryText = '';
         this.updateTasksAndStat();
       }
     });*/
  }

  onSearchTasks(searchString: string): void {
    /* this.searchTaskText = searchString;*/
    this.updateTasks();
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
