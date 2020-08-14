import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public set(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  public get(key: string): any {
    return JSON.parse(sessionStorage.getItem(key));
  }

  public remove(key: string): void {
    return sessionStorage.removeItem(key);
  }
}
