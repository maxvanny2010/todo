import {Component, OnInit} from '@angular/core';
import {DataHandlerService} from '../../services/data-handler.service';
import {Category} from '../../model/interfaces';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category | undefined;

  constructor(private data: DataHandlerService) {
  }

  ngOnInit(): void {
    this.data.categorySubject.subscribe(categories => this.categories = categories);
  }

  showTaskBy(category: Category): void {
    this.selectedCategory = category;
    this.data.fillTasksBy(category);
  }
}
