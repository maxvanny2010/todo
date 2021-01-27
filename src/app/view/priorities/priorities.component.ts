import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';
import {EditPriorityDialogComponent} from '../../dialog/edit-priority-dialog/edit-priority-dialog.component';
import {Priority} from '../../model/Priority';
import {DialogAction} from '../../action/DialogResult';

@Component({
  selector: 'app-priorities',
  templateUrl: './priorities.component.html',
  styleUrls: ['./priorities.component.css']
})
export class PrioritiesComponent implements OnInit {

  static defaultColor = '#fff';
  @Input() priorities: Priority[] = [];
  @Output() deletePriority: EventEmitter<Priority> = new EventEmitter<Priority>();
  @Output() updatePriority: EventEmitter<Priority> = new EventEmitter<Priority>();
  @Output() addPriority: EventEmitter<Priority> = new EventEmitter<Priority>();

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  openEdit(priority: Priority): void {
    const dialogRef = this.dialog.open(EditPriorityDialogComponent, {
      /*to send copy cause all changed don't touch original properties*/
      data: [new Priority(priority.id, priority.title, priority.color), 'Редактирование приоритета']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      if (result.action === DialogAction.DELETE) {
        this.deletePriority.emit(priority);
        return;
      }
      if (result.action === DialogAction.SAVE) {
        priority = result.obj as Priority; /*to get changed priority*/
        this.updatePriority.emit(priority);
        return;
      }
    });
  }

  openDelete(priority: Priority): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы хотите удалить категорию: "${priority.title}"? (задачам проставится значение 'Без приоритета')`
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      if (result.action === DialogAction.OK) {
        this.deletePriority.emit(priority);
      }
    });
  }

  openAdd(): void {
    const dialogRef = this.dialog.open(EditPriorityDialogComponent,
      {
        data: /*empty Priority*/
          [new Priority(0, '', PrioritiesComponent.defaultColor),
            'Добавление приоритета'], width: '400px'
      });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) {/*if only close dialog*/
        return;
      }
      if (result.action === DialogAction.SAVE) {
        const newPriority = result.obj as Priority;
        this.addPriority.emit(newPriority);
      }
    });
  }
}
