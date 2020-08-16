import {Component, Input, OnInit} from '@angular/core';
import {PowerBoardService} from "./power-board.service";

@Component({
  selector: 'app-power-board',
  templateUrl: './power-board.component.html',
  styleUrls: ['./power-board.component.scss']
})
export class PowerBoardComponent implements OnInit {
  @Input() docId: string;

  public powerBoardVisible = false;

  // 协作者
  corporations: {username: string, avatar: string, editable: boolean}[] =  [
    { username: 'KaMu1', avatar: '', editable: true},
    { username: 'KaMu2', avatar: '', editable: false},
  ];

  // 管理员
  admins: {username: string, avatar: string}[] = [
    { username: 'KaMu3', avatar: ''},
    { username: 'KaMu4', avatar: ''},
  ];

  // 用户权限等级
  public userPower = 4;

  // 共享设置
  publicShare = false;
  editableShare = false;

  modalControls = {
    addCorporation: false,
    addAdmin: false,
  };

  constructor(
    private powerBoardService: PowerBoardService,
  ) { }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    return;
  }

  openPowerDrawer(): void {
    this.powerBoardVisible = true;
  }

  closePowerDrawer(): void {
    this.powerBoardVisible = false;
  }

  setShareOption(): void {
    let property = 0;
    if (this.publicShare) {
      if (this.editableShare) {
        property = 2;
      }
      else {
        property = 1;
      }
    }
    this.powerBoardService.setShareOption(this.docId, property).subscribe(
      res => console.log(res)
    );
  }

  removeAdmin(username: string): void {
    this.powerBoardService.setPower(this.docId, username, 0).subscribe(
      res => console.log(res)
    );
  }

  addAdmin(): void {
    // if (this.inputInvitedAdmin === '') {
    //   return;
    // }
    // this.powerBoardService.setPower(this.docId, this.inputInvitedAdmin, 3).subscribe(
    //   res => console.log(res)
    // );
  }

  modalClose() {
    this.modalControls.addCorporation = false;
    this.modalControls.addAdmin = false;
  }

  modalOpen(target: string) {
    switch (target) {
      case 'add-corporation':
        this.modalControls.addCorporation = true;
        break;
      case 'add-admin':
        this.modalControls.addAdmin = true;
        break;
    }
  }
}
