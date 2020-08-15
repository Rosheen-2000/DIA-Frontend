import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  public items: {name: string, url: string}[];
  constructor() {
    this.items = [
      {name: '导', url: ''},
      {name: '航', url: ''},
      {name: '栏', url: ''},
    ];
  }
}
