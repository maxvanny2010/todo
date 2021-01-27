import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {Priority} from '../../model/Priority';
import {DialogAction, DialogResult} from '../../action/DialogResult';

@Component({
  selector: 'app-edit-priority-dialog',
  templateUrl: './edit-priority-dialog.component.html',
  styleUrls: ['./edit-priority-dialog.component.css']
})
export class EditPriorityDialogComponent implements OnInit {
  dialogTitle = '';
  priority!: Priority;
  canDelete = false;

  constructor(
    private dialogRef: MatDialogRef<EditPriorityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Priority, string],
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.priority = this.data[0];
    this.dialogTitle = this.data[1];
    if (this.priority && this.priority.id > 0) {
      this.canDelete = true;
    }
  }

  onConfirm(): void {
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.priority));
  }

  onCancel(): void {
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }

  delete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы действительно хотите удалить приоритет: "${this.priority.title}"? (в задачи проставится '')`
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      if (result.action === DialogAction.OK) {
        this.dialogRef.close(new DialogResult(DialogAction.DELETE)); // нажали удалить
      }
    });
  }

}
