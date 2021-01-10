import {Injectable} from '@angular/core';
import * as introJs from 'intro.js';

@Injectable({
  providedIn: 'root'
})
export class IntroService {
  private static INTRO_VIEWED_KEY = 'intro-viewed'; // ключ
  private static INTRO_VIEWED_VALUE = 'done'; // значение


  private introJS = introJs();

  constructor() {
  }

  // показать интро
  public startIntroJS(checkViewed: boolean): void {
    // если ранее пользователь уже посмотрел интро - больше не показывать
    if (checkViewed && localStorage.getItem(IntroService.INTRO_VIEWED_KEY) === IntroService.INTRO_VIEWED_VALUE) {
      return;
    }

    this.introJS.setOptions(
      {
        scrollToElement: false,
        nextLabel: 'след. >',
        prevLabel: '< пред.',
        doneLabel: 'Выход',
        skipLabel: 'х',
        exitOnEsc: true,
        exitOnOverlayClick: false
      });

    this.introJS.start();

    // при закрытии - записываем информацию об этом, чтобы в след. раз не открывать intro еще раз
    this.introJS.onexit((_: any) => localStorage.setItem(IntroService.INTRO_VIEWED_KEY, IntroService.INTRO_VIEWED_VALUE));
  }
}
