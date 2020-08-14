import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Routes} from '@angular/router';
import { UserinfoService } from '../../core/services/userinfo.service'
import { UserInfo } from '../../entity/userinfo'

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
