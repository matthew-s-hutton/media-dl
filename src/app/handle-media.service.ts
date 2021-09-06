import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { handleError } from './handleError';


@Injectable({
  providedIn: 'root'
})
export class HandleMediaService {

  constructor(private http: HttpClient) { }

  public download(mediaUrl: URL) {
    let serv = `https://127.0.0.1:8000`;
    const data = mediaUrl.toString();
    const opts = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<any>(serv, data, opts).pipe(
      tap(ret => console.log(`Return data: ${ret}`)),
      catchError(handleError('post data'))
    )
  }
}
