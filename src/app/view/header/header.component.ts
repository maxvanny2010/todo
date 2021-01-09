import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() categoryName = '';
  @Input() showStat!: boolean;
  @Output() toggleStat: EventEmitter<boolean> = new EventEmitter<boolean>(); // показать/скрыть статистику


  constructor() {
  }

  onToggleStat(): void {
    this.toggleStat.emit(!this.showStat); // вкл/выкл статистику
  }


}
