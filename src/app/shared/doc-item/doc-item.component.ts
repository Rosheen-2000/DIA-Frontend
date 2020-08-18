import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd";
import {DocItemService} from "./doc-item.service";
import { NzMessageService } from 'ng-zorro-antd/message';
import {DocFavorService} from "./doc-favor.service";

@Component({
  selector: 'app-doc-item',
  templateUrl: './doc-item.component.html',
  styleUrls: ['./doc-item.component.scss']
})
export class DocItemComponent implements OnInit {
  @Input() public fileName: string;
  @Input() public fileId: string;

  @Input() public isTrash: boolean;
  @Input() public isFavored: boolean;

  @Output() notify = new EventEmitter();

  sharingVisible = false;
  renameVisible = false;
  isOkLoading = false;
  public newfilename: string = this.fileName;

  constructor(
    private router: Router,
    private nzContextMenuService: NzContextMenuService,
    private docItemService: DocItemService,
    private message: NzMessageService,
    private docFavorService: DocFavorService,
  ) { }

  ngOnInit(): void {
  }

  navigate(): void {
    this.router.navigate(['/docs/' + this.fileId]).then();
  }

  createMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  rename(): void {
    console.log(this.fileId);
    console.log(this.fileName);
    if (this.fileName.length === 0) {
      this.message.create('warning', '请输入非空的文件名');
    }
    else {
      this.isOkLoading = true;
      this.docItemService.rename(this.fileId, this.newfilename).subscribe(
        // TODO 错误信息处理
        res => {
          console.log(res);
          this.isOkLoading = false;
          this.fileName = this.newfilename;
          this.message.create('success', '修改成功');
          this.renameVisible = false;
          this.notify.emit();
        }
      );
    }
  }

  delete(): void {
    this.docItemService.deleteDoc(this.fileId).subscribe(
      res => {
        console.log(res);
        this.notify.emit();
      }
    );
  }

  recovery(): void {
    this.docItemService.recoveryDoc(this.fileId).subscribe(
      res => {
        console.log(res);
        this.notify.emit();
      }
    );
  }

  confirmDelete(): void {
    this.docItemService.confirmDeleteDoc(this.fileId).subscribe(
      res => {
        console.log(res);
        this.notify.emit();
      }
    );
  }

  favor(): void {
    this.docFavorService.favorDoc(this.fileId).subscribe(
      res => {
        this.message.create('success', '成功加入收藏');
        this.isFavored = true;
        this.notify.emit();
      }
    );
  }

  unFavor(): void {
    this.docFavorService.unFavorDoc(this.fileId).subscribe(
      res => {
        this.message.create('success', '成功取消收藏');
        this.isFavored = false;
        this.notify.emit();
      }
    );
  }

  handleCancel(): void {
    this.renameVisible = false;
    this.newfilename = this.fileName;
  }

  sharingCancel(): void {
    this.sharingVisible = false;
  }

  sharingOk(): void {
    this.sharingVisible = false;
  }
}
