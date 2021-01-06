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
  selectedCategory: Category | undefined;

  constructor() {
  }

  showTaskBy(category: Category): void {
    if (this.selectedCategory === category) {
      return;
    }
    this.selectedCategory = category;
    this.selectCategory.emit(this.selectedCategory);
  }
}
