import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewItemService {

  constructor(
    private http: HttpClient,
  ) { }

  public newFolder(foldName: string, folderId: string, spaceId: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('folderName', foldName);
    form.set('folderId', folderId);
    form.set('spaceId', spaceId);
    return this.http.post<any>(environment.baseUrl + 'folder/new-folder/', form);
  }
}
