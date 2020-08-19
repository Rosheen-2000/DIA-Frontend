import {Component, OnInit, Input} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SitemessageService} from '../../core/services/sitemessage.service';
// import {WebsocketService} from '../../core/services/websocket.service';
import {MessageService} from "./message.service";
import { TeamService } from '../teamspace/team.service'


interface Message {
  type: 'normal' | 'invite' | 'comment' | string;
  mid: string;
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
  switchloading = false;
  data: Message[] = [];
  // data: any[] = [
  //   {
  //     mid: '001',
  //     type: 'normal',
  //     isread: true,
  //     content: '普通消息',
  //     teamid: '',
  //     docid: '',
  //     createtime: 'now',
  //   },
  //   {
  //     mid: '002',
  //     type: 'normal',
  //     isread: false,
  //     content: '普通消息',
  //     teamid: '',
  //     docid: '',
  //     createtime: 'now',
  //   },
  //   {
  //     mid: '003',
  //     type: 'invite',
  //     isread: true,
  //     content: '团队邀请消息',
  //     teamid: '1',
  //     docid: '',
  //     createtime: 'now',
  //   },
  //   {
  //     mid: '004',
  //     type: 'invite',
  //     isread: false,
  //     content: '团队邀请消息',
  //     teamid: '1',
  //     docid: '1',
  //     createtime: 'now',
  //   },
  //   {
  //     mid: '005',
  //     type: 'comment',
  //     isread: true,
  //     content: '文档评论消息',
  //     teamid: '',
  //     docid: '',
  //     createtime: 'now',
  //   },
  //   {
  //     mid: '006',
  //     type: 'comment',
  //     isread: false,
  //     content: '文档评论消息',
  //     teamid: '',
  //     docid: '1',
  //     createtime: 'now',
  //   },
  // ];

  constructor(
    private msg: NzMessageService,
    private siteMsgService: SitemessageService,
    private messageService: MessageService,
    private teamservice: TeamService,
    private message: NzMessageService,
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
              type: t, content: p.content, mid: p.mid,
              docid: p.docid, teamid: p.teamid,
              isread: p.isread, createtime: p.createtime
            });
          }
        );
        this.data = tempData;
        console.log('data: ' + this.data);
        this.loading = false;
      }, error => {
        console.log(error);
      }
    );
  }

  agree(target: any, index: number): void {
    this.teamservice.handleInvite(target.teamid, 'true').subscribe(
      res => {
        if (res.msg === 'true') {
          this.message.create('success', '成功加入团队');
          this.data[index].isread = true;
        }
        else {
          this.message.create('error', '加入团队失败，请稍后再试');
        }
      },
      error => {
        this.message.create('error', '奇怪的错误增加了，请稍后再试');
      }
    )
  }

  refuse(target: any, index: number): void {
    this.teamservice.handleInvite(target.teamid, 'false').subscribe(
      res => {
        if (res.msg === 'true') {
          this.message.create('success', '成功拒绝邀请');
          this.data[index].isread = true;
        }
        else {
          this.message.create('error', '拒绝邀请失败，请稍后再试');
        }
      },
      error => {
        this.message.create('error', '奇怪的错误增加了，请稍后再试');
      }
    )
  }

  clickSwitch(target: any, index: number): void {
    this.switchloading = true;
    this.messageService.changeStatus(target.mid, !target.isread).subscribe(
      res => {
        if (res.msg === 'true') {
          this.data[index].isread = !target.isread;
          this.switchloading = false;
        }
        else {
          this.message.create('error', '设置失败，请稍后再试');
          this.switchloading = false;
        }
      },
      error => {
        this.message.create('error', '奇怪的错误增加了，请稍后再试');
          this.switchloading = false;
      }
    )
  }
}
