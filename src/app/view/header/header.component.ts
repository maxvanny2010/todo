import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SettingsDialogComponent} from '../../dialog/settings-dialog/settings-dialog.component';
import {IntroService} from '../../services/intro.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() categoryName = '';
  @Input() showStat!: boolean;
  @Output() toggleStat: EventEmitter<boolean> = new EventEmitter<boolean>(); // показать/скрыть статистику


  constructor(
    private introService: IntroService,
    private dialog: MatDialog) {
  }

  onToggleStat(): void {
    this.toggleStat.emit(!this.showStat); // вкл/выкл статистику
  }


  showSettings(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent,
      {
        autoFocus: false,
        width: '500px'
      });
  }

  showIntroHelp(): void {
    this.introService.startIntroJS(false);
  }
}
