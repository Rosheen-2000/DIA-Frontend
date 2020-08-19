import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { UserinfoService } from '../../../core/services/userinfo.service'
import { PassportService } from '../../../routes/passport/passport.service'
import { StorageService } from '../../../core/services/storage.service'
// import {WebsocketService} from '../../../core/services/websocket.service'
import { environment } from '../../../../environments/environment'
import {HeaderService} from "./header.service";
import { SitemessageService } from '../../../core/services/sitemessage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private readonly wsBaseUrl: string;
  value = '';
  public username: string;
  public avatar: string;
  public isVisible: boolean = false;
  public unreadmsgnum: number;

  private real_time_msg_timer: any;
  public message_content: string;
  @ViewChild("template") tref: TemplateRef<{}>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userinfo_ser: UserinfoService,
    private passport: PassportService,
    private storage: StorageService,
    // public webSocketService: WebsocketService,
    private headerService: HeaderService,
    private sitemessage: SitemessageService,
    private notification: NzNotificationService,
  ) {
    this.wsBaseUrl = environment.wsBaseUrl;
  }

  ngOnInit(): void {
    if (this.storage.get('username') == null) {
      this.userinfo_ser.getBasicInfo('').subscribe (
        res => {
          if (res.msg === 'true') {
            this.username = res.uname;
            this.avatar = res.avatar;
            this.storage.set('username', res.uname);
            this.storage.set('avatar', res.avatar);
          }
        }
      );
    }
    else {
      this.username = this.storage.get('username');
      this.avatar = this.storage.get('avatar');
    }

    this.freshMessageNum();

    // this.webSocketService.connect(this.wsBaseUrl + 'echo?name=' + this.username);
    // 接收消息
    // this.webSocketService.messageSubject.subscribe(
    //   data => {
    //     switch(data.basicmsg) {
    //       // 新通知
    //       case 0:
    //         console.log('收到了新的实时通知');
    //         break;
    //       // 登录收到的统计信息
    //       case 1:
    //         console.log('收到了统计信息');
    //         console.log(data.num);
    //         break;
    //     }
    //   }
    // );
  }

  ngAfterViewInit() {
    // this.sitemessage.getOfflineMsgNum().subscribe(
    //   res => {
    //     if (res.num > 0) {
    //       this.notification.blank(
    //         '请确认您的新消息',
    //         '您在下线期间共收到${res.num}条新消息，点击查看'
    //       )
    //       .onClick.subscribe(() => {
    //         this.router.navigate(['messagebox']);
    //       });
    //     }
    //   }
    // );
    this.real_time_msg_timer = setInterval(() => {
      this.getRealTimeMsg();
    }, 15000);
  }

  private getRealTimeMsg() {
    this.sitemessage.getRealTimeMessage().subscribe(
      res => {
        if (res.mid !== '') {
          this.message_content = res.content;
          this.notification.template(this.tref);
          this.getRealTimeMsg();
        }
        else {
          console.log('无新的实时消息');
        }
      },
      error => {
        console.log('拉取实时消息出错');
      }
    )
  }

  public navigate() {
    this.router.navigate(['messagebox']);
  }

  freshMessageNum(): void {
    this.headerService.getMessageNum().subscribe(
      res => this.unreadmsgnum = res.num
    );
  }

  onChanged(event: any): void {
    this.router.navigate(['/space/' + event]).then();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  logout(): void {
    this.passport.logout();
    location.reload();
  }

  ngOnDestroy() {
    clearInterval(this.real_time_msg_timer);
  }
}
