import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { UserinfoService } from '../../../core/services/userinfo.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  value = '';
  public username: string;
  public avatar: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userinfo_ser: UserinfoService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
        this.value = params['id'];
        console.log(this.value);
      }
    );
    
    // 临时
    localStorage.setItem('avatar', 'https://c-ssl.duitang.com/uploads/item/202006/21/20200621110632_xyicf.thumb.700_0.jpg');
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
}
