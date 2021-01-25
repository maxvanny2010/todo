import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EditCategoryDialogComponent} from '../../dialog/edit-category-dialog/edit-category-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Category} from '../../model/Category';
import {CategorySearchValues} from '../../data/dao/search/SearchObjects';
import {DialogAction} from '../../action/DialogResult';

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
    this.categories = categories;
  }

  @Input('categorySearchValues')
  set setCategorySearchValues(categorySearchValues: CategorySearchValues) {
    this.categorySearchValues = categorySearchValues;
  }

  @Input('uncompletedCountForCategoryAll')
  set uncompletedCount(uncompletedCountForCategoryAll: number) {
    this.uncompletedCountForCategoryAll = uncompletedCountForCategoryAll;
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: [new Category(category.id, category.title),
        'Редактирование категории'], width: '400px'
    });
    dialogRef.afterClosed()
      .subscribe(result => {
        if (!result) {
          return;
        }
        if (result.action === DialogAction.DELETE) {
          this.deleteCategory.emit(category);
          return;
        }

        if (result.action === DialogAction.SAVE) {
          this.updateCategory.emit(result.obj as Category);
          return;
        }
      });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: [new Category(null, ''), 'Добавление категории'],
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      if (result.action === DialogAction.SAVE) {
        this.addCategory.emit(result.obj as Category);
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

  showCategory(category: Category | undefined): void {
    if (this.selectedCategory === category) {
      return;
    }
    this.selectedCategory = category;
    this.selectCategory.emit(this.selectedCategory);
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
