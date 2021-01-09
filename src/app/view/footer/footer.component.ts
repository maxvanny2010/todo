import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AboutDialogComponent} from '../../dialog/about-dialog/about-dialog.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  site = '#';
  blog = '#';
  year = '2020';
  siteName = 'Mailtime';

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  openAboutDialog(): void {
    this.dialog.open(AboutDialogComponent,
      {
        data: {
          dialogTitle: 'О программе',
          message: `Приложение создано для отображения возможностей Angular  в ${this.year} году.`
        },
        width: '400px',
        autoFocus: false
      },
    );
  }
}
