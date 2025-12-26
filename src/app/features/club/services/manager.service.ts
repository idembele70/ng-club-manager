import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Manager } from '../models/manager.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  private readonly http = inject(HttpClient);

  exists(name: Manager['name']): Observable<boolean> {
    return this.http.get('/manager/search', {
      params: new HttpParams().set('name', name)
    }).pipe(
      map((manager) => !!manager),
    );
  }
}
