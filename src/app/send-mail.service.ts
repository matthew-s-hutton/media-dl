import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { handleError } from './handleError';

@Injectable({
  providedIn: 'root'
})
export class SendMailService {

  constructor(private http: HttpClient) { }

  public sendmail(userData: object) {
    let serv = "https://127.0.0.1:3000/sendmail"
    const opts = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<any>(serv, userData, opts).pipe(
      tap(ret => console.log(`Return data: ${ret}`)),
      catchError(handleError('post data'))
    )
  }
}
