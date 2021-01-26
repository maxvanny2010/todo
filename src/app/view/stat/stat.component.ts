import {Component, Input, OnInit} from '@angular/core';
import {DashboardData} from '../../action/DashboardData';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit {

  @Input() dash!: DashboardData;

  @Input() showStat!: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

  getTotal(): number {
    if (this.dash) {
      return this.dash.completedTotal + this.dash.uncompletedTotal;
    }
    return 0;
  }

  getCompletedCount(): number {
    if (this.dash) {
      return this.dash.completedTotal;
    }
    return 0;
  }

  getUncompletedCount(): number {
    if (this.dash) {
      return this.dash.uncompletedTotal;
    }
    return 0;
  }

  getCompletedPercent(): number {
    if (this.dash) {
      return this.dash.completedTotal ? (this.dash.completedTotal / this.getTotal()) : 0;
    }
    return 0;
  }

  getUncompletedPercent(): number {
    if (this.dash) {
      return this.dash.uncompletedTotal ? (this.dash.uncompletedTotal / this.getTotal()) : 0;
    }
    return 0;
  }
}
