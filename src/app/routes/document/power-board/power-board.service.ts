import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PowerBoardService {

  constructor(
    private http: HttpClient,
  ) { }

  public getCollaborators(): Observable<any> {
    return;
  }
}
