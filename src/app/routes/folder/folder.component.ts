import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {FolderService} from './services/folder.service';
import {BreadcrumbService} from '../../core/services/breadcrumb.service';
import {DesktopService} from './services/desktop.service';
import {SpaceService} from './services/space.service';
import {DashboardService} from './services/dashboard.service';
import {FreshFolderService} from "../../core/services/fresh-folder.service";

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
    private freshFolderService: FreshFolderService,
  ) { }

  ngOnInit(): void {
    this.freshFolderService.messageSource.subscribe(
      Message => {
        if (Message === 'fresh') {
          this.initData();
        }
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    // if (changes.spaceId) {
    //   if (!changes.spaceId.firstChange) {
    //     this.initData();
    //   }
    // }
    this.initData();
  }

  onNotify(): void {
    this.initData();
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
        this.spaceService.getSpaceName(this.spaceId).subscribe(
          res => {
            this.breadcrumbService.space(this.spaceId, res.spaceName);
          }
        );
        break;
      case 'folder':
        this.initFolder();
        this.breadcrumbService.folder(this.folderId);
    }
  }

  initDesktop(): void {
    console.log('init desktop');
    this.loading.folder = true;
    this.loading.file = true;
    this.desktopService.getDesktopFile().subscribe(
      res => {
        this.subFiles = res.files;
        this.loading.file = false;
      }
    );
    this.desktopService.getDesktopFolder().subscribe(
      res => {
        this.subFolders = res.folders;
        this.loading.folder = false;
      }
    );
  }

  initDashboard(): void {
    console.log('init dashboard');
    this.loading.file = true;
    this.dashboardServices.getFiles(this.rootType).subscribe(
      res => {
        this.subFiles = res.files;
        this.loading.file = false;
      }
    );
    if (this.rootType === 'trash') {
      this.loading.folder = true;
      this.dashboardServices.getTrashFolder().subscribe(
        res => {
          console.log(res);
          const resFolder: {id: string, name: string, starred: boolean}[] = [];
          res.folders.forEach(
            (p) => {
              resFolder.push({id: p.folderid, name: p.foldername, starred: false});
            }
          );
          this.subFolders = resFolder;
          this.loading.folder = false;
        }
      );
    }
  }

  initSpace() {
    console.log('init space');
    this.loading.file = true;
    this.loading.folder = true;
    this.spaceService.getFiles(this.spaceId).subscribe(
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
    this.spaceService.getFolders(this.spaceId).subscribe(
      res => {
        this.subFolders = res.folders;
        this.loading.folder = false;
      }, error => {
        console.log(error);
        this.loading.folder = false;
      }
    );
  }

  initFolder(): void {
    this.loading.file = true;
    this.loading.folder = true;
    this.folderService.getSubFiles(this.folderId).subscribe(
      res => {
        this.subFiles = res.files;
        this.loading.file = false;
      }
    );
    this.folderService.getSubFolders(this.folderId).subscribe(
      res => {
        this.subFolders = res.folders;
        this.loading.folder = false;
      }
    )
  }
}
