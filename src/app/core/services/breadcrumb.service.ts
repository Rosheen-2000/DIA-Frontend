import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  public items: { name: string, url: string }[] = [];
  public path: { foldId: string, spaceId: string } = {foldId: '', spaceId: ''};

  constructor(
    private http: HttpClient,
  ) {
    this.items = [
      {name: '导', url: ''},
      {name: '航', url: ''},
      {name: '栏', url: ''},
    ];
  }

  public clear(): void {
    this.items = [];
  }

  public dashboard(rootType: 'own' | 'favorites' | 'used' | 'trash'): void {
    this.path.foldId = '';
    this.path.spaceId = '';
    switch (rootType) {
      case 'favorites':
        this.items = [{name: '我的收藏', url: '/dashboard/favorites'}];
        break;
      case 'own':
        this.items = [{name: '我创建的', url: '/dashboard/own'}];
        break;
      case 'trash':
        this.items = [{name: '回收站', url: '/dashboard/trash'}];
        break;
      case 'used':
        this.items = [{name: '最近使用', url: '/dashboard/used'}];
    }
  }

  public desktop(): void {
    this.items = [{name: '我的桌面', url: '/desktop'}];
    this.path.foldId = '';
    this.path.spaceId = '';
  }

  public folder(folderId: string): void {
    this.path.foldId = folderId;
    return;
  }

  private space(spaceId: string): void {
    this.path.spaceId = spaceId;
  }

  private fetchFolderPath(): Observable<any> {
    return;
  }
}
