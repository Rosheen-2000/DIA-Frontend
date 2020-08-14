import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Routes} from '@angular/router';
import { UserinfoService } from '../../core/services/userinfo.service'
import { UserInfo } from '../../entity/userinfo'
import { NzMessageService } from 'ng-zorro-antd/message';

/*********table里的内容***********/
interface information {
  infoHead: string;
  infoBody: string;
  action: string;
}

@Component({
  selector: 'app-userspace',
  templateUrl: './userspace.component.html',
  styleUrls: ['./userspace.component.scss']
})
export class UserspaceComponent implements OnInit {

  // public userid: string;
  public currentuser: UserInfo;
  public loading: boolean = true;
  // 标记是否是在访问自己的空间，以控制敏感信息的展示
  // public selfcheck: boolean = false;
  public changePwdVisible: boolean = false;
  public changeMailVisible: boolean = false;
  public changePhoneNoVisible: boolean = false;
  public isOkLoading: boolean = false;

  public currentpwd: string;
  public newpwd: string;
  public confirmpwd: string;
  public newmail: string;
  public newphone: string;

  /*********table里的内容***********/
  listOfData: information[] = [
    {
      infoHead: '用户名',
      infoBody: '',
      action: '修改密码'
    },
    {
      infoHead: '手机',
      infoBody: '',
      action: '修改'
    },
    {
      infoHead: '邮箱',
      infoBody: '',
      action: '修改'
    }
  ];

  constructor(
    private actroute: ActivatedRoute,
    private userservice: UserinfoService,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
    // 获取uid
    // this.actroute.params.subscribe((params: Params) => {
    //   this.userid = params.id;
    //   console.log(this.userid);
    // });
    // 检查是否在访问自己的主页
    // this.userservice.checkOwn(this.userid).subscribe(
    //   res => {
    //     if (res.msg === 'true') {
    //       this.selfcheck = true;
    //     }
    //     else if (res.msg === 'false') {
    //       this.selfcheck = false;
    //     }
    //   }
    // );
    // * 获取用户基本信息
    this.userservice.getUserInfo('').subscribe(
      res => {
        if (res.msg === 'true') {
          this.currentuser = new class implements UserInfo {
            uid = '';
            uname = res.uname;
            avatar = res.avatar;
            mail = res.mail;
            phoneno = res.phoneno;
          };
          // this.currentuser.uid = this.userid;
          // this.loading = false;  // ! 测试中 临时关闭
        }
      }
    );

    // ! 测试用
    this.currentuser = new class implements UserInfo {
      uid = '111';
      uname = '接头霸王';
      avatar = '../../../assets/default-avatar.jpeg';
      mail = 'debug@cheating.com';
      phoneno = '114514';
    };
    this.listOfData[0].infoBody = this.currentuser.uname;
    this.listOfData[1].infoBody = this.currentuser.phoneno;
    this.listOfData[2].infoBody = this.currentuser.mail;
    this.loading = false;
  }

  public changePwd(): void {
    if (this.newpwd!==this.confirmpwd) {
      this.message.create('error', '两次输入的密码不匹配，请确认后再提交');
    }
    else {
      this.isOkLoading = true;
      this.userservice.changePwd(this.currentpwd, this.newpwd).subscribe(
        res => {
          if (res.msg === 'true') {
            this.message.create('success', '修改成功！');
            this.isOkLoading = false;
            this.changePwdVisible = false;
          }
          else if (res.msg === 'notmatch') {
            this.message.create('error', '密码输入错误，请核对后再提交');
            this.isOkLoading = false;
          }
        }
      )
    }
  }

  public changeMail() {
    this.isOkLoading = true;
    this.userservice.changeMail(this.newmail).subscribe(
      res => {
        if (res.msg === 'true') {
          this.currentuser.mail = this.newmail;
          this.message.create('success', '修改成功！');
          this.isOkLoading = false;
          this.changePwdVisible = false;
        }
      }
    )
  }

  public changePhoneNo() {
    this.isOkLoading = true;
    this.userservice.changePhoneNo(this.newphone).subscribe(
      res => {
        if (res.msg === 'true') {
          this.currentuser.phoneno = this.newphone;
          this.message.create('success', '修改成功！');
          this.isOkLoading = false;
          this.changePwdVisible = false;
        }
      }
    )
  }

  public showChangePwd(): void {
    console.log('change pwd');
    this.changePwdVisible = true;
  }

  public showChangeMail(): void {
    this.changeMailVisible = true;
  }

  public showChangePhoneNo(): void {
    this.changePhoneNoVisible = true;
  }

  public handleCancel(): void {
    this.changePwdVisible = false;
    this.changeMailVisible = false;
    this.changePhoneNoVisible = false;
  }

  public doAction(data: any): void {
    console.log('111');
    
    switch(data.infoHead) {
      case '用户名':
        this.showChangePwd();
        break;
      case '手机':
        this.showChangePhoneNo();
        break;
      case '邮箱':
        this.showChangeMail();
        break;
    }
  }

}



