import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EditCategoryDialogComponent} from '../../dialog/edit-category-dialog/edit-category-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {OperType} from '../../dialog/OperType';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Category} from '../../model/Category';
import {CategorySearchValues} from '../../data/dao/search/SearchObjects';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  categories: Category[] = [];
  filterTitle!: string | null;
  filterChanged!: boolean;
  indexMouseMove!: number;
  showEditIconCategory!: boolean;
  categorySearchValues!: CategorySearchValues;
  uncompletedCountForCategoryAll!: number;
  selectedCategory!: Category | undefined;
  /*@Output*/
  @Output() selectCategory: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() deleteCategory: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() updateCategory: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() addCategory: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() searchCategory: EventEmitter<CategorySearchValues> = new EventEmitter<CategorySearchValues>();
  isMobile!: boolean;
  isTablet!: boolean;

  constructor(
    private deviceService: DeviceDetectorService,
    private dialog: MatDialog) {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
  }

  /*@Input*/
  @Input('selectedCategory')
  set setCategory(selectedCategory: Category | undefined) {
    this.selectedCategory = selectedCategory;
  }

  @Input('categories')
  set setCategories(categories: Category[]) {
    this.categories = categories; // категории для отображения
  }

  @Input('categorySearchValues')
  set setCategorySearchValues(categorySearchValues: CategorySearchValues) {
    this.categorySearchValues = categorySearchValues;
  }

  // используется для категории Все
  @Input('uncompletedCountForCategoryAll')
  set uncompletedCount(uncompletedCountForCategoryAll: number) {
    this.uncompletedCountForCategoryAll = uncompletedCountForCategoryAll;
  }

  showTaskBy(category: Category | undefined): void {
    if (this.selectedCategory === category) {
      return;
    }
    this.selectedCategory = category;
    this.selectCategory.emit(this.selectedCategory);
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      maxWidth: '400px',
      data: [category.title, 'Редактирование категории', OperType.EDIT]
    });
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === 'delete') {
          this.deleteCategory.emit(category);
        } else if (result as string) {
          category.title = result as string;
          this.updateCategory.emit(category);
        }
      });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: ['', 'Добавление категории', OperType.ADD], width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addCategory.emit(result);
      }
    });
  }

  search(): void {
    /*reset*/
    this.filterChanged = false;
    /*if object for search not empty*/
    if (!this.categorySearchValues) {
      return;
    }
    this.categorySearchValues.title = this.filterTitle;
    this.searchCategory.emit(this.categorySearchValues);
  }

  checkFilterChanged(): boolean {
    this.filterChanged = this.filterTitle !== this.categorySearchValues.title;
    return this.filterChanged;

  }

  showCategory(category: Category): void {

  }

  showEditIcon(show: boolean, index: number): void {
    this.indexMouseMove = index;
    this.showEditIconCategory = show;
  }

  clearAndSearch(): void {
    this.filterTitle = null;
    this.search();
  }
}
