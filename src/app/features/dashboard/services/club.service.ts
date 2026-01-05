import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Club } from '../models/club.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClubService {
  private readonly http = inject(HttpClient);

  exists(name: Club['name']): Observable<boolean> {
    return this.http.get<Club>(`/clubs/search`, {
      params: new HttpParams().set('name', name)
    }).pipe(
      map((club) => !!club),
    );
  }
}
