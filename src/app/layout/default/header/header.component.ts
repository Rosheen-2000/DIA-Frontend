import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { UserinfoService } from '../../../core/services/userinfo.service'
import { PassportService } from '../../../routes/passport/passport.service'

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
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
        this.value = params['id'];
        console.log(this.value);
      }
    );
    
    // 临时
    localStorage.setItem('avatar', '../../../../assets/default-avatar.jpeg');
    localStorage.setItem('username', '接头霸王');

    if (localStorage.getItem('username')===null) {
      this.userinfo_ser.getBasicInfo('').subscribe (
        res => {
          if (res.msg === 'true') {
            this.username = res.uname;
            this.avatar = res.avatar;
            localStorage.setItem('username', res.uname);
            localStorage.setItem('avatar', res.avatar);
          }
        }
      );
    }
    else {
      this.username = localStorage.getItem('username');
      this.avatar = localStorage.getItem('avatar');
    }
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
}
