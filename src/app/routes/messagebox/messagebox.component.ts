import {Component, OnInit, Input} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SitemessageService} from '../../core/services/sitemessage.service';
import {WebsocketService} from '../../core/services/websocket.service';
import {MessageService} from "./message.service";


interface Message {
  type: 'normal' | 'invite' | 'comment' | string;
  isread: boolean;
  content: string;
  docid: string;
  teamid: string;
  createtime: string;
}

@Component({
  selector: 'app-messagebox',
  templateUrl: './messagebox.component.html',
  styleUrls: ['./messagebox.component.scss']
})
export class MessageboxComponent implements OnInit {
  // 样式用数据
  loading = false;
  data: Message[] = [];

  constructor(
    private msg: NzMessageService,
    private siteMsgService: SitemessageService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    console.log('init messages');
    this.loading = true;
    const tempData: Message[] = [];
    this.messageService.getMessage().subscribe(
      res => {
        console.log(res);
        res.msgs.forEach(
          (p) => {
            const t = ['normal', 'invite', 'comment'][p.msgtype];
            tempData.push({
              type: t, content: p.content,
              docid: p.docid, teamid: p.teamid,
              isread: p.isread, createtime: p.createtime
            });
          }
        );
        this.loading = false;
        this.data = tempData;
      }, error => {
        console.log(error);
      }
    );
  }

  set
}
