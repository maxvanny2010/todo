import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogAction, DialogResult} from '../../action/DialogResult';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  dialogTitle = '';
  message = '';

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { dialogTitle: string, message: string }
  ) {
    this.dialogTitle = data.dialogTitle;
    this.message = data.message;
  }

  confirm(): void {
    this.dialogRef.close(new DialogResult(DialogAction.OK));
  }

  cancel(): void {
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
}
