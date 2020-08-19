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

  public getSubFolders(): { Id: string, Name: string }[] {
    return [
      {Id: 'Folder1', Name: 'Folder1'},
      {Id: 'Folder2', Name: 'Folder2'}
    ];
  }

  public getSubFiles(folderId: string): Observable<{ files: { id: string, name: string, starred: boolean }[]}> {
    const params = new HttpParams().set('folderId', folderId);
    return this.http.get<any>(environment.baseUrl + 'doc/folder/file', {params});
  }
}
