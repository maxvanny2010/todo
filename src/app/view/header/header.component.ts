import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SettingsDialogComponent} from '../../dialog/settings-dialog/settings-dialog.component';
import {IntroService} from '../../services/intro.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {DialogAction} from '../../action/DialogResult';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() categoryName = '';
  @Input() showStat!: boolean;
  @Output() toggleStat: EventEmitter<boolean> = new EventEmitter<boolean>(); /*show|hide stat block*/
  @Output() toggleMenu: EventEmitter<any> = new EventEmitter<any>();
  @Output() settingsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
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
    this.toggleStat.emit(!this.showStat);
  }


  showSettings(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent,
      {
        autoFocus: false,
        width: '500px'
      });
    dialogRef.afterClosed().subscribe(result => {
        if (result && result.acton === DialogAction.SETTING_CHANGE) {
          this.settingsChanged.emit(true);
          return;
        }
      }
    );
  }

  showIntroHelp(): void {
    this.introService.startIntroJS(false);
  }

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }

  isMobileButton(): string {
    if (this.isMobile || this.isTablet) {
      return '30';
    }
    return '';
  }
}
