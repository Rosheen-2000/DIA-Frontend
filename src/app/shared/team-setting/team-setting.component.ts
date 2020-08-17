import {Component, Input, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {TeamSettingService} from './team-setting.service';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-team-setting',
  templateUrl: './team-setting.component.html',
  styleUrls: ['./team-setting.component.scss']
})
export class TeamSettingComponent implements OnInit {
  @Input() teamId: string;

  drawerVisible = false;
  selectedUsername: string;
  searchResult: { username: string, avatar: string, userId: string };

  createdTime: string;
  creator: string;

  public members: {username: string, avatar: string, userId}[] = [
    { username: 'KaMu1', avatar: '', userId: '1'},
    { username: 'KaMu2', avatar: '', userId: '2'},
    { username: 'KaMu3', avatar: '', userId: '3'},
    { username: 'KaMu4', avatar: '', userId: '4'},
    { username: 'KaMu5', avatar: '', userId: '5'},
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
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    this.teamSettingService.getInfo().subscribe(
      res => {
        console.log(res);
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
      avatar: '',
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
