import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { UserinfoService } from '../../../core/services/userinfo.service'
import { PassportService } from '../../../routes/passport/passport.service'
import { StorageService } from '../../../core/services/storage.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  value = '';
  public username: string;
  public avatar: string;
  public isVisible: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userinfo_ser: UserinfoService,
    private passport: PassportService,
    private storage: StorageService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
        this.value = params['id'];
        console.log(this.value);
      }
    );
    
    // 临时
    this.storage.set('avatar', '../../../../assets/default-avatar.jpeg');
    this.storage.set('username', '接头霸王');

    if (this.storage.get('username')===null) {
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
  }

  onChanged(event: any): void {
    this.router.navigate(['/space/' + event]).then();
  }

  toMySpace(): void {
    this.router.navigateByUrl('userspace');
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
}
