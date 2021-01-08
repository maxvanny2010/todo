import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Category} from '../../model/interfaces';
import {EditCategoryDialogComponent} from '../../dialog/edit-category-dialog/edit-category-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {OperType} from '../../dialog/OperType';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  @Input() categories: Category[] = [];
  @Output() selectCategory: EventEmitter<Category> = new EventEmitter<Category>();
  @Input() selectedCategory: Category | undefined;
  indexMouseMove: number | undefined;
  @Output() deleteCategory: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() updateCategory: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() addCategory: EventEmitter<string> = new EventEmitter<string>();

  constructor(private dialog: MatDialog) {
  }

  showTaskBy(category: Category | undefined): void {
    if (this.selectedCategory === category) {
      return;
    }
    this.selectedCategory = category;
    this.selectCategory.emit(this.selectedCategory);
  }

  showEditIcon(index: number | undefined): void {
    this.indexMouseMove = index;
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
        } else if (result as Category) {
          this.updateCategory.emit(result);
        }
      });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: ['', 'Добавление категории', OperType.ADD], width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addCategory.emit(result as string);
      }
    });
  }
}
