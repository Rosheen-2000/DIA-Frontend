import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {InfoModalService} from './info-modal.service';

interface Information {
  infoHead: string;
  infoBody: string;
  action: string;
}

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent implements OnInit, OnChanges {
  @Input() userId: string;
  listOfData: Information[] = [
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

  constructor(
    private infoModalService: InfoModalService,
  ) { }

  ngOnInit(): void {
    console.log('modal' + this.userId);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initData();
  }

  initData(): void {
    this.infoModalService.getAllInfo(this.userId).subscribe(
      res => console.log(res)
    );
  }

}
