import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

// JSON формируется автоматически для параметров и результатов
export class CommonService<T> {

  private readonly url: string;

  constructor(url: string, public http: HttpClient) {
    this.url = url;
  }

  add(t: T): Observable<T> {
    return this.http.post<T>(this.url + '/add', t);
  }

  delete(id: number): Observable<T> {
    return this.http.delete<T>(this.url + '/delete/' + id);
  }

  findById(id: number): Observable<T> {
    return this.http.get<T>(this.url + '/id/' + id);
  }

  findAll(): Observable<T[]> {
    return this.http.get<T[]>(this.url + '/all');
  }

  update(t: T): Observable<T> {
    return this.http.put<T>(this.url + '/update', t);
  }
}
