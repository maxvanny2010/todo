import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {DeviceDetectorService} from 'ngx-device-detector';
import {DialogAction, DialogResult} from '../../action/DialogResult';
import {Category} from '../../model/Category';
import {Priority} from '../../model/Priority';
import {Task} from 'src/app/model/Task';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})
export class EditTaskDialogComponent implements OnInit {

  /*to get from base page and don't use db*/
  categories: Category[] = [];
  priorities: Priority[] = [];
  isMobile = this.deviceService.isMobile();
  dialogTitle = '';
  task!: Task;
  /*local variable. to use when|if to back changes*/
  newTitle = '';
  newPriorityId!: number;
  newCategoryId!: number | null;
  newDate!: Date | undefined;
  /*for counter*/
  oldCategoryId!: number | null;
  canDelete = false;
  canComplete = false;
  today = new Date();

  constructor(
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Task, string, Category[], Priority[]],
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService
  ) {
  }

  ngOnInit(): void {
    this.task = this.data[0];
    this.dialogTitle = this.data[1];
    this.categories = this.data[2];
    this.priorities = this.data[3];
    /*if id > 0 it is edit and show buttons for edit*/
    if (this.task && this.task.id > 0) {
      this.canDelete = true;
      this.canComplete = true;
    }
    /*init start variable cause new data to write in task and can make back*/
    this.newTitle = this.task.title;
    /*select only with id*/
    if (this.task.priority) {
      this.newPriorityId = this.task.priority.id;
    }
    if (this.task.category) {
      this.newCategoryId = this.task.category.id;
      this.oldCategoryId = this.task.category.id; /*to save old category*/
    }
    if (this.task.date) {
      /*create new date cause to get local time zone, otherwise time UTC */
      this.newDate = new Date(this.task.date);
    }
  }

  confirm(): void {
    this.task.title = this.newTitle;
    this.task.priority = this.findPriorityById(this.newPriorityId);
    this.task.category = this.findCategoryById(this.newCategoryId);
    this.task.oldCategory = this.findCategoryById(this.oldCategoryId);
    if (!this.newDate) {
      this.task.date = undefined;
    } else {
      /*onInit() create date local time zone*/
      this.task.date = this.newDate;
    }
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.task));

  }

  cancel(): void {
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }

  delete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы действительно хотите удалить задачу: "${this.task.title}"?`
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) {
        return;
      }
      if (result.action === DialogAction.OK) {
        this.dialogRef.close(new DialogResult(DialogAction.DELETE));
      }
    });
  }

  complete(): void {
    this.dialogRef.close(new DialogResult(DialogAction.COMPLETE));

  }

  activate(): void {
    this.dialogRef.close(new DialogResult(DialogAction.ACTIVATE));
  }

  addDays(days: number): void {
    this.newDate = new Date();
    this.newDate.setDate(this.today.getDate() + days);
  }

  setToday(): void {
    this.newDate = this.today;
  }

  private findPriorityById(tmpPriorityId: number | null): Priority | undefined {
    return this.priorities.find(t => t.id === tmpPriorityId);
  }

  private findCategoryById(tmpCategoryId: number | null): Category | undefined {
    return this.categories.find(t => t.id === tmpCategoryId);
  }

}
