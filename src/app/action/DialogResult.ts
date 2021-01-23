export class DialogResult {
  constructor(public action: DialogAction, public obj?: any) {
  }
}

export enum DialogAction {
  SETTING_CHANGE,
  SAVE,
  OK,
  CANCEL,
  DELETE,
  COMPLETE,
  ACTIVATE
}
