import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd";
import {DocItemService} from "./doc-item.service";
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-doc-item',
  templateUrl: './doc-item.component.html',
  styleUrls: ['./doc-item.component.scss']
})
export class DocItemComponent implements OnInit {
  @Input() public fileName: string;
  @Input() public fileId: string;

  @Input() public isTrash: boolean;

  @Output() notify = new EventEmitter();

  renameVisible = false;
  isOkLoading = false;
  public newfilename: string = this.fileName;

  constructor(
    private router: Router,
    private nzContextMenuService: NzContextMenuService,
    private docItemService: DocItemService,
    private message: NzMessageService,
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
    if (this.fileName.length===0) {
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
    this.docItemService.favorDoc(this.fileId).subscribe(
      res => {
        this.message.create('success', '成功加入收藏');
        this.notify.emit();
      }
    )
  }

  handleCancel(): void {
    this.renameVisible = false;
    this.newfilename = this.fileName;
  }
}
