import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {SpinnerService} from '../services/spinner.service';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(public service: SpinnerService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.service.show();
    return next.handle(req)
      .pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            this.service.hide();
          }
        }),
        catchError((err: HttpErrorResponse) => {
          this.service.hide();
          return throwError(err);
        })
      );
  }

}
