import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {PriorityService} from '../../data/dao/impl/priority.service';
import {DialogAction, DialogResult} from '../../action/DialogResult';
import {Priority} from '../../model/Priority';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {
  priorities: Priority[] = [];
  settingsChanged = false;

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    private priorityService: PriorityService
  ) {
  }

  ngOnInit(): void {
    this.priorityService.findAll().subscribe(priorities => this.priorities = priorities);
  }

  onClose(): void {
    if (this.settingsChanged) { // если в настройках произошли изменения
      this.dialogRef.close(new DialogResult(DialogAction.SETTING_CHANGE, this.priorities));
    } else {
      this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
    }
  }

  onAddPriority(priority: Priority): void {
    this.settingsChanged = true; /*if properties changed*/
    this.priorityService.add(priority).subscribe(result => {
      this.priorities.push(result);
    });
  }

  onUpdatePriority(priority: Priority): void {
    this.settingsChanged = true;
    this.priorityService.update(priority).subscribe(() => {
      this.priorities[this.getPriorityIndex(priority)] = priority;
    });
  }

  onDeletePriority(priority: Priority): void {
    this.settingsChanged = true;
    this.priorityService.delete(priority.id).subscribe(() => {
        this.priorities.splice(this.getPriorityIndex(priority), 1);
      }
    );
  }

  getPriorityIndex(priority: Priority): number {
    const tmpPriority = this.priorities.find(t => t.id === priority.id);
    if (tmpPriority) {
      return this.priorities.indexOf(tmpPriority);
    }
    return -1;
  }

}
