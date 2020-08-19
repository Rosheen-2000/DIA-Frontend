import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SharingModalService} from "./sharing-modal.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-sharing-modal',
  templateUrl: './sharing-modal.component.html',
  styleUrls: ['./sharing-modal.component.scss']
})
export class SharingModalComponent implements OnInit, OnChanges {
  @Input() docId: string;
  @Input() fresh: boolean;

  public link: string;

  public shareOption = 0;

  constructor(
    private shareModalService: SharingModalService,
    private message: NzMessageService,
  ) {
  }

  ngOnInit(): void {
    if (!this.docId) {
      return;
    }
    this.link = '106.15.74.187/docs/' + this.docId;
    this.shareModalService.getPower(this.docId).subscribe(
      res => {
        console.log(this.docId);
        console.log(res);
        this.shareOption = res.shareProperty;
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit();
  }

  copy() {
    this.message.success('链接已复制到粘贴板');
  }
}
