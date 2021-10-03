import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendMailService {

  constructor(private http: HttpClient) { }

  /**
   * Communicates with endpoint used to send email.
   * @param userData 
   * @returns 
   */
  public sendmail(userData: Record<string, unknown>): Observable<any> {
    const serv = "https://twt-dl.app/sendmail"
    const opts = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<any>(serv, userData, opts)
  }
}
