import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {BreadcrumbService} from '../../core/services/breadcrumb.service';
import {NzContextMenuService, NzDropdownMenuComponent, NzMessageService} from 'ng-zorro-antd';
import {FolderItemService} from "./folder-item.service";

@Component({
  selector: 'app-folder-item',
  templateUrl: './folder-item.component.html',
  styleUrls: ['./folder-item.component.scss']
})
export class FolderItemComponent implements OnInit {
  @Input() public folderName: string;
  @Input() public folderId: string;

  @Output() public notify = new EventEmitter();

  public modalInput = '';
  public modalControls = {
    loading: false,
    deleteFolder: false,
    renameFolder: false,
    moveFolder: false,
  };

  constructor(
    private router: Router,
    private breadService: BreadcrumbService,
    private nzContextMenuService: NzContextMenuService,
    private foldItemService: FolderItemService,
    private message: NzMessageService,
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
    this.modalControls.moveFolder = false;
    this.modalControls.renameFolder = false;
  }

  deleteFolder() {
    this.modalControls.deleteFolder = true;
  }

  deleteFolderConfirm() {
    this.modalControls.loading = true;
    this.foldItemService.deleteFolder(this.folderId).subscribe(
      res => {
        if (res.msg === 'true') {
          this.message.success('删除成功');
          this.closeModal();
          this.notify.emit();
        } else {
          console.log(res.msg);
          this.message.error('您的权限不足');
          this.closeModal();
        }
      }, error => {
        this.message.error('删除失败');
        this.closeModal();
      }
    );
  }

  renameFolder() {
    this.modalInput = '';
    this.modalControls.renameFolder = true;
  }

  renameFolderConfirm() {
    this.modalControls.loading = true;
    this.foldItemService.renameFolder(this.folderId, this.modalInput).subscribe(
      res => {
        if (res.msg === 'true') {
          this.message.success('修改成功');
          this.closeModal();
          this.notify.emit();
        }
      }, error => {
        this.message.error('修改失败');
        this.closeModal();
      }
    );
  }

  moveFolder() {
    this.modalControls.moveFolder = true;
  }

  moveFolderConfirm() {
    this.closeModal();
  }
}
