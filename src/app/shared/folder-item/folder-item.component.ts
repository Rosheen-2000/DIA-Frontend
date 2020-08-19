import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BreadcrumbService} from '../../core/services/breadcrumb.service';
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd";

@Component({
  selector: 'app-folder-item',
  templateUrl: './folder-item.component.html',
  styleUrls: ['./folder-item.component.scss']
})
export class FolderItemComponent implements OnInit {
  @Input() public folderName: string;
  @Input() public folderId: string;

  public modalControls = {
    loading: false,
    deleteFolder: false,
  };

  constructor(
    private router: Router,
    private breadService: BreadcrumbService,
    private nzContextMenuService: NzContextMenuService,
  ) { }

  ngOnInit(): void {
  }

  navigate(): void {
    this.router.navigate(['/folder/' + this.folderId]).then();
  }

  createMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeModal(): void {
    this.modalControls.loading = false;
    this.modalControls.deleteFolder = false;
  }

  deleteFolder() {
    this.modalControls.deleteFolder = true;
  }
}
