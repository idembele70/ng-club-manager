import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";

export class HttpUtilities {
  static missingFieldsError(url: string, i18nKey: Error['message']) {
    return throwError(() => new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      url,
      error: new Error(i18nKey),
    }));
  }

  static unauthorizedError(url: string, i18nKey: Error['message']): Observable<never> {
    return throwError(() => new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      url,
      error: new Error(i18nKey),
    }));
  }

  static notFoundError(url: string, i18nKey: Error['message']): Observable<never> {
    return throwError(() => new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      url,
      error: new Error(i18nKey),
    }));
  }

  static getReqSuccessResponse<T>(url: string, body: T): Observable<HttpResponse<T>> {
    return of(new HttpResponse({
      status: 200,
      statusText: 'OK',
      url,
      body,
    }));
  }

  static postReqSuccessResponse<T>(url: string, body: T): Observable<HttpResponse<T>> {
    return of(new HttpResponse({
      status: 201,
      statusText: 'created',
      url,
      body,
    }));
  }
}