import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.css']
})
export class StatCardComponent {

  @Input()
  completed = false;

  @Input()
  iconName = '';

  @Input()
  count1: any;

  @Input()
  count2: any;

  @Input()
  title = '';

  constructor() {
  }
}
