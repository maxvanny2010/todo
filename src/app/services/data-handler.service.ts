import {Injectable} from '@angular/core';
import {TestData} from '../data/TestData';
import {Category} from '../model/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

  constructor() {
  }

  getCategories(): Category[] {
    return TestData.categories;
  }
}
