import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FreshFolderService {

  public messageSource = new BehaviorSubject<string>('Start');

  public changemessage(message: string): void {
    this.messageSource.next(message);
  }
  constructor() { }
}
