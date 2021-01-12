import {Component, Inject, OnInit} from '@angular/core';
import {Category, Priority, Task} from 'src/app/model/interfaces';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DataHandlerService} from '../../services/data-handler.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {OperType} from '../OperType';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})
export class EditTaskDialogComponent implements OnInit {
  dialogTitle = '';
  task!: Task;
  tmpTitle = '';
  tmpDate!: Date | undefined;
  tmpCategory: Category | undefined;
  tmpPriority: Priority | undefined;
  operType!: OperType;
  categories: Category[] = [];
  priorities: Priority[] = [];
  isMobile!: boolean;
  /* link to current modal window*/
  /* data was to sent into modal window*/
  /*service*/

  /*for open new dialog from current dialog for confirm*/

  constructor(
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Task, string, OperType],
    private dataHandler: DataHandlerService,
    private deviceService: DeviceDetectorService,
    private dialog: MatDialog
  ) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.task = this.data[0];
    this.dialogTitle = this.data[1];
    this.operType = this.data[2];
    /*to use tmp cause it will be chance to make rollback*/
    this.tmpTitle = this.task.title;
    this.tmpCategory = this.task.category;
    this.tmpPriority = this.task.priority;
    this.tmpDate = this.task.date;
    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
    this.dataHandler.getAllPriorities().subscribe(priorities => this.priorities = priorities);
  }

  onConfirm(): void {
    /*to write fo save item in futures*/
    this.task.title = this.tmpTitle;
    /*to sent change item to handler modal*/
    this.task.category = this.tmpCategory;
    this.task.priority = this.tmpPriority;
    this.task.date = this.tmpDate;
    // console.log(this.task);
    this.dialogRef.close(this.task);
  }

  onCancel(): void {
    this.dialogRef.close(null);
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
      if (result) {
        this.dialogRef.close('delete');
      }
    });
  }

  complete(): void {
    this.dialogRef.close('complete');
  }

  activate(): void {
    this.dialogRef.close('activate');
  }

  canDelete(): boolean {
    return this.operType === OperType.EDIT;
  }

  canActivateDeactivate(): boolean {
    return this.operType === OperType.EDIT;
  }
}
