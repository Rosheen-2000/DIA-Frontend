import {Component, Input, OnInit} from '@angular/core';
import {PowerBoardService} from './power-board.service';
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-power-board',
  templateUrl: './power-board.component.html',
  styleUrls: ['./power-board.component.scss']
})
export class PowerBoardComponent implements OnInit {
  @Input() docId: string;
  @Input() isTeamDoc: boolean;

  public powerBoardVisible = false;

  // 协作者
  corporations: { username: string, avatar: string, editable: boolean }[] = [
    {username: 'KaMu1', avatar: '', editable: true},
    {username: 'KaMu2', avatar: '', editable: false},
  ];

  // 团队成员
  teamMembers: { username: string, avatar: string, editable: boolean }[] = [
    {username: 'KaMu5', avatar: '', editable: true},
    {username: 'KaMu6', avatar: '', editable: false},
  ];

  // 管理员
  admins: { username: string, avatar: string }[] = [
    {username: 'KaMu3', avatar: ''},
    {username: 'KaMu4', avatar: ''},
  ];

  // 用户权限等级
  public userPower = 4;

  // 共享设置
  publicShare = true;
  editableShare = false;

  selectedUsername: string;
  searchResult: { username: string, avatar: string, userId: string };

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
  ) {
  }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    this.powerBoardService.getPower(this.docId).subscribe(
      res => {
        console.log(res);
        this.publicShare = res.shareProperty > 0;
        this.editableShare = res.shareProperty === 2;
        this.userPower = res.userPower;
      }
    );

    this.powerBoardService.getCollaborators(this.docId).subscribe(
      res => {
        console.log('corp');
        console.log(res);
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
    // this.powerBoardService.search(this.selectedUsername).subscribe(
    //   res => {
    //     console.log(res);
    //   }
    // );
    this.searchResult = {
      username: 'search',
      avatar: '',
      userId: '1',
    };
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
}
