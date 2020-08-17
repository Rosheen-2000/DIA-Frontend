import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  public items: { name: string, url: string }[];

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
    this.items = [{name: '我的桌面', url: '/desktop'}]
  }

  public folder(folderId: string): void {
    return;
  }

  private fetchFolderPath(): Observable<any> {
    return;
  }
}
