import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService<T> {
  setValue(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getValue(key: string): T | null {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  }
}
