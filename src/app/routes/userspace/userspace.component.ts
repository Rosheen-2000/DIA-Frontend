import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Routes} from '@angular/router';
import { UserinfoService } from '../../core/services/userinfo.service'
import { UserInfo } from '../../entity/userinfo'
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';

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
  public currentuser: UserInfo = {
    uid: '',
    uname: '',
    avatar: '',
    mail: '',
    phoneno: '',
  };
  public loading: boolean = true;
  // 标记是否是在访问自己的空间，以控制敏感信息的展示
  // public selfcheck: boolean = false;
  public changeAvatarVisible: boolean = false;
  public changePwdVisible: boolean = false;
  public changeMailVisible: boolean = false;
  public changePhoneNoVisible: boolean = false;
  public isOkLoading: boolean = false;
  public avatarloading = false;
  public avatarUrl?: string;

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
          }();
          this.listOfData[0].infoBody = this.currentuser.uname;
          this.listOfData[1].infoBody = this.currentuser.phoneno;
          this.listOfData[2].infoBody = this.currentuser.mail;
          this.loading = false;
        }
      }
    );
  }

  public changePwd(): void {
    if (this.newpwd!==this.confirmpwd) {
      this.message.create('error', '两次输入的密码不匹配，请确认后再提交');
    }
    else {
      this.isOkLoading = true;
      this.userservice.changePwd(this.currentpwd, this.newpwd).subscribe(
        res => {
          console.log(res);
          if (res.msg === 'true') {
            this.message.create('success', '修改成功！');
            this.isOkLoading = false;
            this.changePwdVisible = false;
            this.ngOnInit();
          }
          else {
            this.message.create('error', '密码输入错误，请核对后再提交');
            this.isOkLoading = false;
            this.changePwdVisible = false;
          }
        }
      );
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
          this.changeMailVisible = false;
          this.ngOnInit();
        }
      }
    );
  }

  public changePhoneNo() {
    this.isOkLoading = true;
    this.userservice.changePhoneNo(this.newphone).subscribe(
      res => {
        if (res.msg === 'true') {
          this.currentuser.phoneno = this.newphone;
          this.message.create('success', '修改成功！');
          this.isOkLoading = false;
          this.changePhoneNoVisible = false;
          this.ngOnInit();
        }
      }
    );
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.message.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.message.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });
  };

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this.message.error('Network error');
        this.loading = false;
        break;
    }
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  public changeAvatar(): void {
    this.isOkLoading = true;
    this.userservice.changeAvatar(this.avatarUrl).subscribe(
      res => {
        if (res.msg === 'true') {
          this.message.create('success', '头像上传成功');
          this.isOkLoading = false;
          this.changeAvatarVisible = false;
        }
        else {
          this.message.create('error', '头像上传失败');
          this.isOkLoading = false;
        }
      },
      error => {
        this.message.create('error', '奇怪的错误增加了');
        this.isOkLoading = false;
      }
    )
  }

  public showChangeAvatar(): void {
    this.changeAvatarVisible = true;
  }

  public showChangePwd(): void {
    this.changePwdVisible = true;
  }

  public showChangeMail(): void {
    this.changeMailVisible = true;
  }

  public showChangePhoneNo(): void {
    this.changePhoneNoVisible = true;
  }

  public handleCancel(): void {
    this.changeAvatarVisible = false;
    this.changePwdVisible = false;
    this.changeMailVisible = false;
    this.changePhoneNoVisible = false;
    this.isOkLoading = false;
  }

  public doAction(data: any): void {
    switch (data.infoHead) {
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



