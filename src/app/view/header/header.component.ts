import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SettingsDialogComponent} from '../../dialog/settings-dialog/settings-dialog.component';
import {IntroService} from '../../services/intro.service';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() categoryName = '';
  @Input() showStat!: boolean;
  @Output() toggleStat: EventEmitter<boolean> = new EventEmitter<boolean>(); // показать/скрыть статистику
  @Output() toggleMenu: EventEmitter<any> = new EventEmitter<any>(); // показать/скрыть статистику
  isMobile = false;
  isTablet = false;

  constructor(
    private introService: IntroService,
    private deviceService: DeviceDetectorService,
    private dialog: MatDialog,
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
  }

  onToggleStat(): void {
    this.toggleStat.emit(!this.showStat); // вкл/выкл статистику
  }


  showSettings(): void {
    this.dialog.open(SettingsDialogComponent,
      {
        autoFocus: false,
        width: '500px'
      });
  }

  showIntroHelp(): void {
    this.introService.startIntroJS(false);
  }

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }
}
