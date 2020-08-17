import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TeamService } from '../../routes/teamspace/team.service'
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-searchuser',
  templateUrl: './searchuser.component.html',
  styleUrls: ['./searchuser.component.scss']
})
export class SearchuserComponent implements OnInit {

  @Input() teamid: string;

  public search_content = null;
  public loading: boolean = false;
  public selected_list: {userid: string, username: string, avatar: string}[] = [];
  public selected_uid: string[] = [];

  res_users$: Observable<{ username: string, avatar: string, userid: string }>;
  private searchText$ = new Subject<string>();
  res_users: { username: string, avatar: string, userid: string }[] = [];

  constructor(
    private teamservice: TeamService,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.res_users$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(username => 
        this.teamservice.getUserByName(username)),
    );
    this.res_users$.subscribe(res => this.res_users[0] = res);
  }

  search(): void {
    this.searchText$.next(this.search_content);
    console.log('onsearch');
  }

  select(target): void {
    console.log('clicked');
    if (this.selected_uid.indexOf(target.userid)===-1) {
      this.selected_list.push(target);
      this.selected_uid.push(target.userid);
    }
    else {
      this.message.create('warning', '已添加当前用户');
    }
    this.search_content = '';
  }

  remove(i): void {
    this.selected_list.splice(i, 1);
    this.selected_uid.splice(i, 1);
  }

  invite(): void {
    this.teamservice.inviteUser(this.teamid, this.selected_uid).subscribe(
      res => {
        if (res.msg === 'true') {
          this.message.create('seccess', '已发出邀请');
        }
        else {
          this.message.create('error', '邀请失败，请稍后再试');
        }
      },
      error => {
        this.message.create('error', '奇怪的错误增加了，请稍后再试');
      }
    );
  }

}
