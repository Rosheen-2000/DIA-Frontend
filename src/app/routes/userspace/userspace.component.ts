import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Routes} from '@angular/router';
import { UserinfoService } from '../../core/services/userinfo.service'
import { UserInfo } from '../../entity/userinfo'

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

  public userid: string;
  public currentuser: UserInfo;
  public loading: boolean = true;
  // * 标记是否是在访问自己的空间，以控制敏感信息的展示
  public selfcheck: boolean = false;

  /*********table里的内容***********/
  listOfData: information[] = [
    {
      infoHead: '用户名',
      infoBody: 'UserName',
      action: '修改密码'
    },
    {
      infoHead: '手机',
      infoBody: '123456789',
      action: '修改'
    },
    {
      infoHead: '邮箱',
      infoBody: 'xxxxxxxx@sample.com',
      action: '修改'
    }
  ];

  constructor(
    private actroute: ActivatedRoute,
    private userservice: UserinfoService,
  ) { }

  ngOnInit(): void {
    this.actroute.params.subscribe((params: Params) => {
      this.userid = params.id;
      console.log(this.userid);
    });
    this.userservice.checkOwn(this.userid).subscribe(
      res => {
        if (res.msg === 'true') {
          this.selfcheck = true;
        }
        else if (res.msg === 'false') {
          this.selfcheck = false;
        }
      }
    );
    this.userservice.getUserInfo(this.userid).subscribe(
      res => {
        if (res.msg === 'true') {
          this.currentuser = new class implements UserInfo {
            uid = '';
            uname = res.uname;
            avatar = res.avatar;
            mail = res.mail;
            phoneno = res.phoneno;
          };
          this.currentuser.uid = this.userid;
          this.loading = false;
        }
      }
    );
  }

  public changePwd() {
    
  }

  public changeMail() {

  }

  public changePhoneNo() {
    
  }

}



