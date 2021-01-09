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
  count: any; // можно передавать любой тип для отображения (число, текст и пр.)

  @Input()
  countTotal: any;

  @Input()
  title = '';

  constructor() {
  }
}
