import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {FolderService} from './services/folder.service';
import {BreadcrumbService} from '../../core/services/breadcrumb.service';
import {DesktopService} from './services/desktop.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {
  @Input() type: string;
  // user desktop space folder

  // user
  @Input() rootType: string;

  // space
  @Input() spaceId: string;

  // folder
  private folderId: string;


  public subFolders: {Id: string, Name: string}[];
  public subFiles: {id: string, name: string}[] = [];

  constructor(
    private route: ActivatedRoute,
    private folderService: FolderService,
    public breadcrumbService: BreadcrumbService,
    private desktopService: DesktopService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.folderId = params.id;
      if (this.folderId) {
        this.type = 'folder';
        console.log(this.folderId);
      }
      this.initData();
    });
  }

  onNotify(): void {
    this.ngOnInit();
  }

  initData(): void {
    switch (this.type) {
      case 'desktop':
        this.initDesktop();
        break;
      case 'user':
        this.initUser();
        break;
      case 'space':
        this.initSpace();
        break;
      case 'folder':
        this.initFolder();
    }
  }

  initDesktop(): void {
    this.desktopService.getDesktopFile().subscribe(
      res => {
        console.log(res);
        this.subFiles = res;
      }
    );
  }

  initUser(): void {
    this.folderService.getFiles(this.rootType).subscribe(
      res => {
        this.subFiles = res;
        console.log(res);
      }
    );
  }

  initSpace(): void {

  }

  initFolder(): void {

  }
}
