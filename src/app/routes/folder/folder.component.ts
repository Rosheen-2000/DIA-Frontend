import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {FolderService} from './services/folder.service';
import {BreadcrumbService} from '../../core/services/breadcrumb.service';
import {DesktopService} from './services/desktop.service';
import {SpaceService} from './services/space.service';
import {DashboardService} from './services/dashboard.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit, OnChanges {
  @Input() type: 'dashboard'|'desktop'|'space'|'folder';

  // dashboard
  @Input() rootType: 'own'|'favorites'|'used'|'trash';

  // space
  @Input() spaceId: string;

  // folder
  @Input() folderId: string;

  public loading = {
    file: false,
    folder: false,
  };


  public subFolders: {id: string, name: string}[] = [];
  public subFiles: {id: string, name: string, starred: boolean}[] = [];

  constructor(
    private route: ActivatedRoute,
    private folderService: FolderService,
    public breadcrumbService: BreadcrumbService,
    private desktopService: DesktopService,
    private spaceService: SpaceService,
    private dashboardServices: DashboardService,
  ) { }

  ngOnInit(): void {
    console.log('ngoninit');
    this.initData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.spaceId) {
      if (!changes.spaceId.firstChange) {
        this.initData();
      }
    }
  }

  onNotify(): void {
    this.ngOnInit();
  }

  initData(): void {
    console.log('init data');
    switch (this.type) {
      case 'desktop':
        this.initDesktop();
        this.breadcrumbService.desktop();
        break;
      case 'dashboard':
        this.initDashboard();
        this.breadcrumbService.dashboard(this.rootType);
        break;
      case 'space':
        this.initSpace();
        this.breadcrumbService.space(this.spaceId, 'xxx');
        break;
      case 'folder':
        this.initFolder();
    }
  }

  initDesktop(): void {
    this.desktopService.getDesktopFile().subscribe(
      res => {
        this.subFiles = res.files;
      }
    );
    this.desktopService.getDesktopFolder().subscribe(
      res => {
        this.subFolders = res.folders;
      }
    );
  }

  initDashboard(): void {
    this.loading.file = true;
    this.dashboardServices.getFiles(this.rootType).subscribe(
      res => {
        this.subFiles = res.files;
        this.loading.file = false;
      }
    );
  }

  initSpace() {
    console.log('init space');
    this.loading.file = true;
    const request = this.spaceService.getFiles(this.spaceId).subscribe(
      res => {
        console.log(res);
        this.subFiles = res.files;
        this.loading.file = false;
      }, error => {
        console.log(error);
        this.loading.file = false;
      }, () => {
        console.log('complete');
      }
    );
  }

  initFolder(): void {
    this.loading.file = true;
    this.folderService.getFiles(this.folderId).subscribe(
      res => {
        this.subFiles = res;
        this.loading.file = false;
      }
    );
  }
}
