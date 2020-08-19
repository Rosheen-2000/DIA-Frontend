import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ) { }

  public getFiles(rootType: string): Observable<{ files: { id: string, name: string, starred: boolean }[]}> {
    return this.http.get<{ files: { id: string, name: string, starred: boolean }[]}>(environment.baseUrl + 'doc/' + rootType + '/file/');
  }

  public getTrashFolder(): Observable<{ folders: {foldername: string, folderid: string}[]}> {
    return this.http.post<any>(environment.baseUrl + 'folder/in-trash/', null);
  }
}
