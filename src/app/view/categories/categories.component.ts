import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Category} from '../../model/interfaces';

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

  constructor() {
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

  }
}
