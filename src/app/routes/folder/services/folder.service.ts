import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  private readonly baseUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.baseUrl = environment.baseUrl;
  }

  public getSubFiles(folderId: string): Observable<{ files: { id: string, name: string, starred: boolean }[]}> {
    const form = new FormData();
    form.set('folderId', folderId);
    return this.http.post<any>(environment.baseUrl + 'doc/folder/file/', form);
  }

  public getSubFolders(folderId: string): Observable<{ folders: {name: string, id: string}[]}> {
    const form = new FormData();
    form.set('folderId', folderId);
    return this.http.post<any>(environment.baseUrl + 'doc/folder/folder/', form);
  }
}
