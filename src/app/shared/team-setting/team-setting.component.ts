import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {TeamSettingService} from './team-setting.service';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {SearchuserComponent} from '../searchuser/searchuser.component';
import { NzModalService} from 'ng-zorro-antd';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-team-setting',
  templateUrl: './team-setting.component.html',
  styleUrls: ['./team-setting.component.scss']
})
export class TeamSettingComponent implements OnInit, OnChanges {
  @Input() teamId: string;

  drawerVisible = false;
  selectedUsername: string;
  searchResult: { username: string, useravatar: string, userId: string };

  createdTime: string;
  creator: string;

  public members: {uid: string, uname: string, useravatar: string}[] = [
    { uname: 'KaMu1', useravatar: '', uid: '1'},
    { uname: 'KaMu2', useravatar: '', uid: '2'},
    { uname: 'KaMu3', useravatar: '', uid: '3'},
    { uname: 'KaMu4', useravatar: '', uid: '4'},
    { uname: 'KaMu5', useravatar: '', uid: '5'},
  ];

  modalControls = {
    loading: false,
    destroyTeam: false,
    addMember: false,
    removeMember: false,
  };

  constructor(
    private httpClient: HttpClient,
    private teamSettingService: TeamSettingService,
    private router: Router,
    private message: NzMessageService,
    public modal: NzModalService,
  ) {}

  ngOnInit(): void {
    // this.initData();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.teamId);
    if (this.teamId){
      this.initData();
    }
  }

  initData(): void {
    this.teamSettingService.getInfo(this.teamId).subscribe(
      res => {
        console.log(res);
        this.createdTime = res.createtime;
        this.creator = res.creatorname;
        this.members = res.member;
      }
    );
  }

  search(): void {
    // this.powerBoardService.search(this.selectedUsername).subscribe(
    //   res => {
    //     console.log(res);
    //   }
    // );
    this.searchResult = {
      username: 'search_result',
      useravatar: '',
      userId: '1',
    };
  }

  openDrawer(): void {
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
  }

  closeModal(): void {
    this.modalControls.destroyTeam = false;
    this.modalControls.addMember = false;
    this.modalControls.removeMember = false;
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
}
