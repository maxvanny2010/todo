import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Priority} from '../../model/interfaces';
import {MatDialog} from '@angular/material/dialog';
import {OperType} from '../../dialog/OperType';
import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';
import {EditPriorityDialogComponent} from '../../dialog/edit-priority-dialog/edit-priority-dialog.component';

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

  openEditPriority(priority: Priority): void {
    const dialogRef = this.dialog.open(EditPriorityDialogComponent,
      {
        data: [priority.title, 'Редактирование приоритета', OperType.EDIT]
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deletePriority.emit(priority);
      } else if (result as string) {
        priority.title = result as string;
        this.updatePriority.emit(priority);
      }
    });
  }

  delete(priority: Priority): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        maxWidth: '500px',
        data: {
          dialogTitle: 'Подтвердите действие',
          message: `Вы действительно хотите удалить категорию: "${priority.title}?(задачи становяться без Приоритета)`
        },
        autoFocus: false
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePriority.emit(priority);
      }
    });
  }

  onAddPriority(): void {
    const dialogRef = this.dialog.open(EditPriorityDialogComponent,
      {
        data: ['', 'Добавление приоритета', OperType.ADD],
        width: '400px'
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newPriority: Priority = {id: 0, title: result as string, color: PrioritiesComponent.defaultColor};
        this.addPriority.emit(newPriority);
      }
    });
  }
}
