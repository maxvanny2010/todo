import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {Category} from '../../model/Category';
import {DialogAction, DialogResult} from '../../action/DialogResult';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.css']
})
export class EditCategoryDialogComponent implements OnInit {
  dialogTitle = '';
  category!: Category;
  canDelete = false;
  isMobile!: boolean;

  constructor(
    private dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Category, string],
    private deviceService: DeviceDetectorService,
    private dialog: MatDialog,
  ) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.category = this.data[0];
    this.dialogTitle = this.data[1];
    if (this.category && this.category.id && this.category.id > 0) {
      this.canDelete = true;
    }
  }

  confirm(): void {
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.category));
  }

  cancel(): void {
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }

  delete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        maxWidth: '500px',
        data: {
          dialogTitle: 'Подтвердите действие',
          message: `Вы действительно хотите удалить категорию: "${this.category.title}"?(задачи не удаляются)`,
        },
        autoFocus: false
      });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      if (result.action === DialogAction.OK) {
        this.dialogRef.close(new DialogResult(DialogAction.DELETE));
      }
    });
  }
}
