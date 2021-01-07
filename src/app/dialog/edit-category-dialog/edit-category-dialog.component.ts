import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Category} from '../../model/interfaces';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.css']
})
export class EditCategoryDialogComponent implements OnInit {
  dialogTitle = '';
  categoryTitle = '';
  canDelete = true;
  tmpCategory!: Category;

  constructor(
    private dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Category, string],
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.tmpCategory = this.data[0];
    this.categoryTitle = this.tmpCategory.title;
    this.dialogTitle = this.data[1];
    if (!this.categoryTitle) {
      this.canDelete = false;
    }
  }


  onConfirm(): void {
    this.tmpCategory.title = this.categoryTitle;
    this.dialogRef.close(this.tmpCategory);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          dialogTitle: 'Подтвердите действие',
          message: `Вы действительно хотите удалить катергорию: "${this.categoryTitle}"?(задачи не удаляются)`,
        },
        autoFocus: false
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close('delete');
      }
    });
  }
}
