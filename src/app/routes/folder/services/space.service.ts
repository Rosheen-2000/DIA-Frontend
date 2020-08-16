import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  constructor(
    private http: HttpClient
  ) { }

  public getFiles(spaceId: string): Observable<{ id: string, name: string, starred: boolean }[]>{
    const params = new HttpParams().set('spaceId', spaceId);
    return this.http.get<{ id: string, name: string, starred: boolean }[]>(
      environment.baseUrl + 'doc/space/file', {params});
  }

  public getFolders(spaceId: string): Observable<{ name: string, id: string}[]> {
    const params = new HttpParams().set('spaceId', spaceId);
    return this.http.get<{ name: string, id: string}[]>(environment.baseUrl + 'doc/space/folder', {params});
  }
}
