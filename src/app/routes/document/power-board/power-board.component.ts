import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PowerBoardService} from './power-board.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {InfoModalComponent} from "../../../shared/info-modal/info-modal.component";

@Component({
  selector: 'app-power-board',
  templateUrl: './power-board.component.html',
  styleUrls: ['./power-board.component.scss']
})
export class PowerBoardComponent implements OnInit, OnChanges {
  @Input() docId: string;
  @Input() isTeamDoc: boolean;

  public powerBoardVisible = false;

  // 协作者
  corporations: { username: string, avatar: string, editable: boolean }[] = [];

  // 团队成员
  teamMembers: { username: string, avatar: string, editable: boolean }[] = [];

  // 管理员
  admins: { username: string, avatar: string, isCreator: boolean, isTeamLeader: boolean }[] = [];

  // 用户权限等级
  public userPower = 4;

  // 共享设置
  publicShare = true;
  editableShare = false;

  selectedUsername: string;
  searchResult: { username: string, avatar: string, userid: string };

  modalControls = {
    loading: false,
    addCorporation: false,
    addAdmin: false,
    removeCorporation: false,
    removeAdmin: false,
  };

  constructor(
    private powerBoardService: PowerBoardService,
    private message: NzMessageService,
    private modal: NzModalService,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.docId) {
      return;
    }
    this.initData();
  }

  initData(): void {
    console.log(this.docId);
    this.powerBoardService.getPower(this.docId).subscribe(
      res => {
        this.publicShare = res.shareProperty > 0;
        this.editableShare = res.shareProperty === 2;
        this.userPower = res.userPower;
      }
    );

    this.powerBoardService.getCollaborators(this.docId).subscribe(
      res => {
        console.log(res);
        const resCorporation: { username: string, avatar: string, editable: boolean }[] = [];
        const resTeamMembers: { username: string, avatar: string, editable: boolean }[] = [];
        const resAdmins: { username: string, avatar: string, isCreator: boolean, isTeamLeader: boolean }[] = [];

        res.level2.forEach(
          (p) => {
            if (p.isTeamMember) {
              resTeamMembers.push({username: p.username, avatar: p.avatar, editable: true});
            } else {
              resCorporation.push({username: p.username, avatar: p.avatar, editable: true});
            }
          });

        res.level1.forEach(
          (p) => {
            if (p.isTeamMember) {
              resTeamMembers.push({username: p.username, avatar: p.avatar, editable: false});
            } else {
              resCorporation.push({username: p.username, avatar: p.avatar, editable: false});
            }
          });

        res.level4.forEach(
          (p) => {
            resAdmins.push({username: p.username, avatar: p.avatar, isCreator: p.isCreator, isTeamLeader: !p.isCreator});
          }
        );

        res.level3.forEach(
          (p) => {
            resAdmins.push({username: p.username, avatar: p.avatar, isCreator: false, isTeamLeader: false});
          }
        );

        this.teamMembers = resTeamMembers;
        this.corporations = resCorporation;
        this.admins = resAdmins;
      }
    );
  }

  openPowerDrawer(): void {
    this.powerBoardVisible = true;
  }

  closePowerDrawer(): void {
    this.powerBoardVisible = false;
  }

  setSharePublic(): void {
    this.modalControls.loading = true;
    let property = 0;
    if (!this.publicShare) {
      if (this.editableShare) {
        property = 2;
      } else {
        property = 1;
      }
    }
    this.powerBoardService.setShareOption(this.docId, property).subscribe(
      res => {
        console.log(res);
        this.modalControls.loading = false;
        this.publicShare = !this.publicShare;
        this.message.create('success', '修改成功');
      }, error => {
        console.log(error);
        this.modalControls.loading = false;
        this.message.create('error', '修改失败');
      }
    );
  }

  setShareEditable(): void {
    this.modalControls.loading = true;
    let property = 1;
    if (!this.editableShare) {
      property = 2;
    }
    this.powerBoardService.setShareOption(this.docId, property).subscribe(
      res => {
        console.log(res);
        this.modalControls.loading = false;
        this.editableShare = !this.editableShare;
        this.message.create('success', '修改成功');
      }, error => {
        console.log(error);
        this.modalControls.loading = false;
        this.message.create('error', '修改失败');
      }
    );
  }

  setCorporationEditable(index: number): void {
    this.modalControls.loading = true;
    let power = 2;
    if (this.corporations[index].editable) {
      power = 1;
    }
    this.powerBoardService.setPower(this.docId, this.corporations[index].username, power).subscribe(
      res => {
        console.log(res);
        this.modalControls.loading = false;
        this.corporations[index].editable = !this.corporations[index].editable;
        this.message.create('success', '设置成功');
      }, error => {
        console.log(error);
        this.modalControls.loading = false;
        this.message.create('error', '设置失败');
      }
    );
  }

  setTeamMemberEditable(index: number): void {
    this.modalControls.loading = true;
    let power = 2;
    if (this.corporations[index].editable) {
      power = 1;
    }
    this.powerBoardService.setPower(this.docId, this.teamMembers[index].username, power).subscribe(
      res => {
        console.log(res);
        this.modalControls.loading = false;
        this.teamMembers[index].editable = !this.teamMembers[index].editable;
        this.message.create('success', '设置成功');
      }, error => {
        console.log(error);
        this.modalControls.loading = false;
        this.message.create('error', '设置失败');
      }
    );
  }

  search(): void {
    this.powerBoardService.search(this.selectedUsername).subscribe(
      res => {
        console.log(res);
        if (res.userid === '') {
          this.searchResult = undefined;
          this.message.create('warning', '不存在此用户')
        }
        else {
          this.searchResult = res;
        }
      },
      error => {
        this.message.create('error', '奇怪的错误增加了，请稍后再试');
      }
    );
    // this.searchResult = {
    //   username: 'search',
    //   avatar: '',
    //   userid: '1',
    // };
  }

  addAdmin(): void {
    this.selectedUsername = '';
    this.searchResult = null;
    this.modalControls.addAdmin = true;
  }

  addAdminConfirm(): void {
    this.modalControls.loading = true;
    this.powerBoardService.setPower(this.docId, this.selectedUsername, 3).subscribe(
      res => {
        console.log(res);
        this.modalControls.loading = false;
        this.modalControls.addAdmin = false;
        this.message.create('success', '添加成功');
        this.initData();
      }, error => {
        console.log(error);
        this.modalControls.loading = false;
        this.modalControls.addAdmin = false;
        this.message.create('error', '添加失败');
      }
    );
  }


  addCorporation(): void {
    this.selectedUsername = '';
    this.searchResult = null;
    this.modalControls.addCorporation = true;
  }

  addCorporationConfirm(): void {
    this.modalControls.loading = true;
    this.powerBoardService.setPower(this.docId, this.selectedUsername, 1).subscribe(
      res => {
        console.log(res);
        this.modalControls.loading = false;
        this.modalControls.addCorporation = false;
        this.message.create('success', '添加成功');
        this.initData();
      }, error => {
        console.log(error);
        this.modalControls.loading = false;
        this.modalControls.addCorporation = false;
        this.message.create('error', '添加失败');
      }
    );
  }

  removeCorporation(selected: string): void {
    this.selectedUsername = selected;
    this.modalControls.removeCorporation = true;
  }

  removeCorporationConfirm(): void {
    this.modalControls.loading = true;
    this.powerBoardService.setPower(this.docId, this.selectedUsername, 0).subscribe(
      res => {
        console.log(res);
        this.modalControls.loading = false;
        this.modalControls.removeCorporation = false;
        this.message.create('success', '删除成功');
        this.initData();
      }, error => {
        console.log(error);
        this.modalControls.loading = false;
        this.modalControls.removeCorporation = false;
        this.message.create('error', '删除失败');
      }
    );
  }

  removeAdmin(selected: string): void {
    this.selectedUsername = selected;
    this.modalControls.removeAdmin = true;
  }

  removeAdminConfirm(): void {
    this.modalControls.loading = true;
    this.powerBoardService.setPower(this.docId, this.selectedUsername, 0).subscribe(
      res => {
        console.log(res);
        this.modalControls.loading = false;
        this.modalControls.removeAdmin = false;
        this.message.create('success', '删除成功');
        this.initData();
      }, error => {
        console.log(error);
        this.modalControls.loading = false;
        this.modalControls.removeAdmin = false;
        this.message.create('error', '删除失败');
      }
    );
  }

  modalClose() {
    this.modalControls.addCorporation = false;
    this.modalControls.addAdmin = false;
    this.modalControls.removeCorporation = false;
    this.modalControls.removeAdmin = false;
  }

  openUserInfo(userId: string) {
    this.modal.create({
      nzTitle: '用户信息',
      nzContent: InfoModalComponent,
      nzComponentParams: {
        userId
      },
    });
  }
}
