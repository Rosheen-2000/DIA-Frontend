import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {TeamSettingService} from './team-setting.service';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import { NzModalService} from 'ng-zorro-antd';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';
import { TeamService } from 'src/app/routes/teamspace/team.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {InfoModalComponent} from "../info-modal/info-modal.component";

@Component({
  selector: 'app-team-setting',
  templateUrl: './team-setting.component.html',
  styleUrls: ['./team-setting.component.scss']
})
export class TeamSettingComponent implements OnInit, OnChanges {
  @Input() teamId: string;

  public teamName = '';

  drawerVisible = false;
  selectedUsername: string;
  searchResult: { username: string, useravatar: string, userId: string };

  createdTime: string;
  creator: string;

  public members: {uid: string, uname: string, useravatar: string}[] = [];

  public userPower: number;

  public search_content = null;
  public loading: boolean = false;
  public selected_list: {userid: string, username: string, avatar: string}[] = [];
  public selected_uid: string[] = [];

  res_users$: Observable<{ username: string, avatar: string, userid: string }>;
  private searchText$ = new Subject<string>();
  res_users: { username: string, avatar: string, userid: string }[] = [];

  modalControls = {
    loading: false,
    destroyTeam: false,
    addMember: false,
    removeMember: false,
    quitTeam: false,
  };

  constructor(
    private httpClient: HttpClient,
    private teamSettingService: TeamSettingService,
    private router: Router,
    private message: NzMessageService,
    public modal: NzModalService,
    private teamservice: TeamService,
  ) {}

  ngOnInit(): void {
    if (this.teamId){
      this.initData();
    };
    this.res_users$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(username =>
        this.teamservice.getUserByName(username)),
    );
    this.res_users$.subscribe(res => {
      // 避免幽灵成员
      if (res.userid === '') {
        this.res_users = [];
      }
      else {
        this.res_users[0] = res;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.teamId){
      this.initData();
    }
  }

  initData(): void {
    this.teamSettingService.getPower(this.teamId).subscribe(
      res => {
        console.log(res);
        this.userPower = res.userPower;
      }
    );
    this.teamSettingService.getInfo(this.teamId).subscribe(
      res => {
        console.log(res);
        this.createdTime = res.createtime;
        this.creator = res.creatorname;
        this.members = res.member;
        this.teamName = res.teamname;
      }
    );
  }

  openDrawer(): void {
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
  }

  closeModal(): void {
    this.modalControls.loading = false;
    this.modalControls.destroyTeam = false;
    this.modalControls.addMember = false;
    this.modalControls.removeMember = false;
    this.modalControls.quitTeam = false;
  }

  destroyTeam(): void {
    this.modalControls.destroyTeam = true;
  }

  destroyTeamConfirm() {
    this.modalControls.loading = true;
    this.teamSettingService.destroyTeam(this.teamId).subscribe(
      res => {
        console.log(res);
        if ( res.msg === 'true') {
          this.modalControls.loading = false;
          this.modalControls.destroyTeam = false;
          this.router.navigate(['/dashboard/own']).then();
          this.message.success('解散成功');
        } else {
          this.modalControls.loading = false;
          this.modalControls.destroyTeam = false;
          this.message.error('解散失败');
        }
      }, error => {
        this.modalControls.loading = false;
        this.modalControls.destroyTeam = false;
        this.message.error('解散失败');
      }
    );
  }

  addMember(): void {
    this.selectedUsername = '';
    this.searchResult = null;
    this.modalControls.addMember = true;
  }

  // addMember() {
  //   const modal = this.modal.create({
  //     nzTitle: '邀请团队成员',
  //     nzContent: SearchuserComponent,
  //     nzComponentParams: {
  //       // modal: modal
  //     },
  //     nzFooter: []
  //   });
  // }

  addMemberConfirm(): void {
    this.modalControls.loading = true;
    this.teamSettingService.addMember(this.teamId, this.searchResult.userId).subscribe(
      res => {
        console.log(res);
        this.modalControls.loading = false;
        this.modalControls.addMember = false;
        this.message.success('已成功发送邀请');
      }, error => {
        this.modalControls.loading = false;
        this.modalControls.addMember = false;
        this.message.error('邀请失败');
      }
    );
  }

  removeMember(userId: string): void {
    this.selectedUsername = userId;
    this.modalControls.removeMember = true;
  }

  removeMemberConfirm(): void {
    this.modalControls.loading = true;
    this.teamSettingService.removeMember(this.teamId, this.selectedUsername).subscribe(
      res => {
        console.log(res);
        this.modalControls.loading = false;
        this.modalControls.removeMember = false;
        this.message.success('移除成功');
      }, error => {
        this.modalControls.loading = false;
        this.modalControls.removeMember = false;
        this.message.error('移除失败');
      }
    );
  }

  quitTeam(): void {
    this.modalControls.quitTeam = true;
  }

  quitTeamConfirm(): void {
    this.modalControls.loading = true;
    this.teamSettingService.quitTeam(this.teamId).subscribe(
      res => {
        if (res.msg === 'true') {
          this.modalControls.loading = false;
          this.modalControls.quitTeam = false;
          this.message.success('退出成功');
          this.router.navigate(['/dashboard/own']);
        }
      }
    );
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

  remove(target): void {
    const _index = this.selected_uid.indexOf(target.userid);
    this.selected_list.splice(_index, 1);
    this.selected_uid.splice(_index, 1);
  }

  invite(): void {
    this.teamservice.inviteUser(this.teamId, this.selected_uid).subscribe(
      res => {
        if (res.msg === 'true') {
          this.message.create('success', '已发出邀请');
          this.selected_list = [];
          this.selected_uid = [];
        }
        else if (res.msg === 'warn') {
          this.message.create('warning', '部分邀请成功，部分所选用户已在团队中');
        }
        else {
          this.message.create('error', '邀请失败，请确认您拥有权限且所选用户不在团队中');
        }
      },
      error => {
        this.message.create('error', '奇怪的错误增加了，请稍后再试');
      }
    );
  }

  openUserInfo(userId: string) {
    console.log(userId);
    this.modal.create({
      nzTitle: '用户信息',
      nzContent: InfoModalComponent,
      nzComponentParams: {
        userId
      },
    });
  }
}
