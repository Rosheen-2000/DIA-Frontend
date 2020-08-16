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
  corporations: {username: string, avatar: string, userid: string}[] =  [
    { username: 'KaMu1', avatar: '', userid: '1'},
  ];

  // 管理员
  admins: {username: string, avatar: string, userid: string}[] = [
    { username: 'KaMu1', avatar: '', userid: '1'},
  ];

  // 用户权限等级
  public userPower = 4;

  // 共享设置
  publicShare = false;
  editableShare = false;

  constructor(
    private powerBoardService: PowerBoardService,
  ) { }

  ngOnInit(): void {
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

  removeAdmin(uid: string): void {
    this.powerBoardService.setPower(this.docId, uid, 0).subscribe(
      res => console.log(res)
    );
  }

  addAdmin(): void {
    this.powerBoardService.setPower(this.docId, '？', 3).subscribe(
      res => console.log(res)
    );
  }
}
