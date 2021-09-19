import { Observable, of } from 'rxjs';

/**
 * Logs errors from services that use Observables.
 * @param result
 * @returns 
 */
export function handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
}