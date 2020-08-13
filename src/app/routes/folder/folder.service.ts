import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(
    private http: HttpClient
  ) {
  }

  public getSubFolders(): { Id: string, Name: string }[] {
    return [
      {Id: 'Folder1', Name: 'Folder1'},
      {Id: 'Folder2', Name: 'Folder2'}
    ];
  }

  public getFiles(rootType: string): { Id: string, Name: string }[] {
    return [
      {Id: rootType + 'File1', Name: rootType + 'File1'},
      {Id: rootType + 'File2', Name: rootType + 'File2'}
    ];
  }

  public getFolderPath(): { Id: string, Name: string }[] {
    return [
      {Id: '', Name: '我的桌面'},
      {Id: 'xxx', Name: 'xxx'},
      {Id: '', Name: '当前文件夹'}
    ];
  }
}
