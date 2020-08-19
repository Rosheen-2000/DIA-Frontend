import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FolderItemService {

  constructor(
    private http: HttpClient,
  ) { }

  public renameFolder(foldId: string, newName: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('folderId', foldId);
    form.set('newName', newName);
    return this.http.post<any>(environment.baseUrl + 'folder/rename/', form);
  }

  public deleteFolder(folderId: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('folderId', folderId);
    return this.http.post<any>(environment.baseUrl + 'folder/delete/', form);
  }

  public recoveryFolder(folderId: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('folderId', folderId);
    return this.http.post<any>(environment.baseUrl + 'folder/recovery-detele/', form);
  }

  public confirmDeleteFolder(folderId: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('folderId', folderId);
    return this.http.post<any>(environment.baseUrl + 'folder/confirm-detele/', form);
  }
}
