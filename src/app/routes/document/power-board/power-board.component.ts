import {Component, Input, OnInit} from '@angular/core';
import {PowerBoardService} from './power-board.service';

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
  corporations: {username: string, avatar: string, editable: boolean}[] =  [
    { username: 'KaMu1', avatar: '', editable: true},
    { username: 'KaMu2', avatar: '', editable: false},
  ];

  // 团队成员
  teamMembers: {username: string, avatar: string, editable: boolean}[] =  [
    { username: 'KaMu5', avatar: '', editable: true},
    { username: 'KaMu6', avatar: '', editable: false},
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

  selectedUsername: string;
  searchResult: {username: string, avatar: string};

  modalControls = {
    addCorporation: false,
    addAdmin: false,
    removeCorporation: false,
    removeAdmin: false,
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

  search(): void {
    this.searchResult = {
      username: 'search',
      avatar: ''
    };
  }

  addAdmin(): void {
    this.selectedUsername = '';
    this.searchResult = null;
    this.modalControls.addAdmin = true;
  }

  addAdminConfirm(): void {
    this.modalControls.addAdmin = false;
  }


  addCorporation(): void {
    this.selectedUsername = '';
    this.searchResult = null;
    this.modalControls.addCorporation = true;
  }

  addCorporationConfirm(): void {

    this.modalControls.addCorporation = false;
  }

  removeCorporation(selected: string): void {
    this.selectedUsername = selected;
    this.modalControls.removeCorporation = true;
  }

  removeCorporationConfirm(): void {
    console.log(this.selectedUsername);
    this.modalControls.removeCorporation = false;
  }

  removeAdmin(selected: string): void {
    this.selectedUsername = selected;
    this.modalControls.removeAdmin = true;
  }

  removeAdminConfirm(): void {
    console.log(this.selectedUsername);
    this.modalControls.removeAdmin = false;
  }

  modalClose() {
    this.modalControls.addCorporation = false;
    this.modalControls.addAdmin = false;
    this.modalControls.removeCorporation = false;
    this.modalControls.removeAdmin = false;
  }
}
