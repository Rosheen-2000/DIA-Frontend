import { Component, OnInit } from '@angular/core';

interface information {
  infoHead: string;
  infoBody: string;
  action: string;
}

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent implements OnInit {

  listOfData: information[] = [
    {
      infoHead: '用户名',
      infoBody: '',
      action: '修改密码'
    },
    {
      infoHead: '手机',
      infoBody: '',
      action: '修改'
    },
    {
      infoHead: '邮箱',
      infoBody: '',
      action: '修改'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
