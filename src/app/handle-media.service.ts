import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { handleError } from './handleError';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HandleMediaService {

  constructor(private http: HttpClient) { }

  /**
   * Communicates with endpoint used to download videos.
   * @param mediaUrl 
   * @returns 
   */
  public download(mediaUrl: URL): Observable<any> {
    const serv = `https://twt-dl.app/downloadmedia `;
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
